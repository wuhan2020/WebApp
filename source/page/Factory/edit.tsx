import { Supplies, Vendor } from '@wuhan2020/rest-api';
import { Contact, GeoCoord } from '@wuhan2020/rest-api';
import { Button, FormField, FormGroup, FormLabel } from 'boot-cell';
import { observable } from 'mobx';
import { attribute, component, observer, WebCell } from 'web-cell';

import { AddressField, ContactField, SessionBox, SuppliesField } from '../../component';
import { factory } from '../../model';
import { mergeList } from '../../utility';
import { RouteRoot } from '../data/menu';
import CommonSupplies from '../data/Supplies';

export interface FactoryEditProps {
    dataId: string;
}

export default interface FactoryEdit extends WebCell<FactoryEditProps> {}

@component({ tagName: 'factory-edit' })
@observer
export default class FactoryEdit extends HTMLElement implements WebCell<FactoryEditProps> {
    @attribute
    @observable
    accessor dataId = '';

    @observable
    accessor state = {
        name: '',
        province: '',
        city: '',
        district: '',
        address: '',
        qualification: '',
        coords: {} as GeoCoord,
        url: '',
        supplies: CommonSupplies as Supplies[],
        contacts: [{} as Contact],
        remark: ''
    } as Partial<Vendor>;

    async mountedCallback() {
        if (!this.dataId) return;

        const {
            name,
            qualification,
            province,
            city,
            district,
            address,
            coords,
            url,
            supplies,
            contacts,
            remark
        } = await factory.getOne(this.dataId);

        this.state = {
            name,
            qualification,
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

        await factory.updateOne(
            {
                ...data,
                supplies: supplies.filter(({ count }) => count),
                contacts: contacts.filter(({ name, phone }) => name?.trim() && phone?.trim())
            },
            this.dataId
        );
        self.alert('提交成功，工作人员审核后即可查看');

        location.hash = RouteRoot.Factory;
    };

    render() {
        const {
            name,
            qualification,
            province,
            city,
            district,
            address,
            url,
            supplies,
            contacts,
            remark
        } = this.state;

        return (
            <SessionBox>
                <h2>生产厂商发布</h2>

                <form onChange={this.changeText} onSubmit={this.handleSubmit}>
                    <FormField name="name" required defaultValue={name} label="厂商名字" />
                    <FormGroup>
                        <FormLabel>机构地址</FormLabel>
                        <AddressField
                            place={name}
                            {...{ province, city, district, address }}
                            onChange={this.changeAddress}
                        />
                    </FormGroup>

                    <FormField type="url" name="url" required defaultValue={url} label="官方网址" />
                    <FormField
                        name="qualification"
                        required
                        defaultValue={qualification}
                        label="资质证明"
                    />
                    <SuppliesField
                        list={supplies}
                        onChange={({ detail }: CustomEvent) => (this.state.supplies = detail)}
                    />
                    <ContactField
                        list={contacts}
                        onChange={({ detail }: CustomEvent) => (this.state.contacts = detail)}
                    />
                    <FormField as="textarea" name="remark" label="备注" defaultValue={remark} />
                    <FormGroup className="mt-3 d-flex flex-column">
                        <Button type="submit" variant="primary" disabled={factory.uploading > 0}>
                            提交
                        </Button>
                        <Button
                            type="reset"
                            variant="danger"
                            onClick={() => (location.hash = RouteRoot.Factory)}
                        >
                            取消
                        </Button>
                    </FormGroup>
                </form>
            </SessionBox>
        );
    }
}
