import { Supplies, SuppliesRequirement } from '@wuhan2020/rest-api';
import { Contact, GeoCoord } from '@wuhan2020/rest-api';
import { Button, FormField, FormGroup } from 'boot-cell';
import { observable } from 'mobx';
import { attribute, component, observer, WebCell } from 'web-cell';

import { AddressField, ContactField, SessionBox, SuppliesField } from '../../component';
import { suppliesRequirement } from '../../model';
import { mergeList } from '../../utility';
import { RouteRoot } from '../data/menu';
import CommonSupplies from '../data/Supplies';

export interface HospitalEditProps {
    dataId: string;
}

export default interface HospitalEdit extends WebCell<HospitalEditProps> {}

@component({ tagName: 'hospital-edit' })
@observer
export default class HospitalEdit extends HTMLElement implements WebCell<HospitalEditProps> {
    @attribute
    @observable
    accessor dataId = '';

    @observable
    accessor state = {
        hospital: '',
        province: '',
        city: '',
        district: '',
        address: '',
        coords: {} as GeoCoord,
        url: '',
        supplies: CommonSupplies as Supplies[],
        contacts: [{} as Contact],
        remark: ''
    } as Partial<SuppliesRequirement>;

    async mountedCallback() {
        if (!this.dataId) return;

        const { name, province, city, district, address, coords, url, supplies, contacts, remark } =
            await suppliesRequirement.getOne(this.dataId);

        this.state = {
            name,
            province,
            city,
            district,
            address,
            coords,
            url,
            supplies: mergeList<Supplies>('name', this.state.supplies, supplies),
            contacts,
            remark
        };
    }

    changeText = ({ target }: Event) => {
        const { name, value } = target as HTMLInputElement;

        this.state = { ...this.state, [name]: value };
    };

    changeAddress = ({ detail: { latitude, longitude, ...rest } }: CustomEvent) =>
        Object.assign(this.state, {
            ...rest,
            coords: { latitude, longitude }
        });

    handleSubmit = async (event: Event) => {
        event.preventDefault();

        const { supplies, contacts, ...data } = this.state;

        await suppliesRequirement.updateOne(
            {
                ...data,
                supplies: supplies.filter(({ count }) => count),
                contacts: contacts.filter(({ name, phone }) => name?.trim() && phone?.trim())
            },
            this.dataId
        );
        self.alert('提交成功，工作人员审核后即可查看');

        location.hash = RouteRoot.Hospital;
    };

    render() {
        const { name, province, city, district, address, url, supplies, contacts, remark } =
            this.state;

        return (
            <SessionBox>
                <h1>医用物资需求发布</h1>

                <form onChange={this.changeText} onSubmit={this.handleSubmit}>
                    <FormField
                        name="name"
                        required
                        defaultValue={name}
                        label="医疗机构"
                        placeholder="可详细至分院、院区、科室"
                    />
                    <FormField label="机构地址">
                        <AddressField
                            place={name}
                            {...{ province, city, district, address }}
                            onChange={this.changeAddress}
                        />
                    </FormField>

                    <FormField type="url" name="url" required defaultValue={url} label="官方网址" />
                    <SuppliesField
                        list={supplies}
                        onChange={({ detail }: CustomEvent) => (this.state.supplies = detail)}
                    />
                    <ContactField
                        list={contacts}
                        onChange={({ detail }: CustomEvent) => (this.state.contacts = detail)}
                    />
                    <FormField is="textarea" name="remark" label="备注" defaultValue={remark} />
                    <FormGroup className="mt-3 d-flex flex-column">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={suppliesRequirement.uploading > 0}
                        >
                            提交
                        </Button>
                        <Button
                            type="reset"
                            variant="danger"
                            onClick={() => (location.hash = RouteRoot.Hospital)}
                        >
                            取消
                        </Button>
                    </FormGroup>
                </form>
            </SessionBox>
        );
    }
}
