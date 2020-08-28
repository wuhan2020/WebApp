import { component, mixin, watch, createCell } from 'web-cell';
import { FormField } from 'boot-cell/source/Form/FormField';
import { Button } from 'boot-cell/source/Form/Button';

import { mergeList } from '../../utility';
import { RouteRoot } from '../data/menu';
import CommonSupplies from '../data/Supplies';
import {
    SuppliesRequirement,
    Supplies,
    suppliesRequirement,
    history
} from '../../model';
import { GeoCoord, Contact } from '../../service';
import {
    SessionBox,
    ContactField,
    AddressField,
    SuppliesField
} from '../../component';

@component({
    tagName: 'hospital-edit',
    renderTarget: 'children'
})
export class HospitalEdit extends mixin<
    { dataId: string },
    SuppliesRequirement
>() {
    @watch
    dataId = '';

    state = {
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
    };

    async connectedCallback() {
        super.connectedCallback();

        if (!this.dataId) return;

        const {
            hospital,
            province,
            city,
            district,
            address,
            coords,
            url,
            supplies,
            contacts,
            remark
        } = await suppliesRequirement.getOne(this.dataId);

        this.setState({
            hospital,
            province,
            city,
            district,
            address,
            coords,
            url,
            supplies: mergeList<Supplies>(
                'name',
                this.state.supplies,
                supplies
            ),
            contacts,
            remark
        });
    }

    changeText = ({ target }: Event) => {
        const { name, value } = target as HTMLInputElement;

        this.state[name] = value;
    };

    updateText = ({ target }: Event) => {
        const { name, value } = target as HTMLInputElement;

        event.stopPropagation();

        this.setState({ [name]: value });
    };

    changeAddress = ({
        detail: { latitude, longitude, ...rest }
    }: CustomEvent) =>
        Object.assign(this.state, {
            ...rest,
            coords: { latitude, longitude }
        });

    handleSubmit = async (event: Event) => {
        event.preventDefault();

        const { supplies, contacts, ...data } = this.state;

        await suppliesRequirement.update(
            {
                ...data,
                supplies: supplies.filter(({ count }) => count),
                contacts: contacts.filter(
                    ({ name, phone }) => name?.trim() && phone?.trim()
                )
            },
            this.dataId
        );
        self.alert('提交成功，工作人员审核后即可查看');

        history.push(RouteRoot.Hospital);
    };

    render(
        _,
        {
            hospital,
            province,
            city,
            district,
            address,
            url,
            supplies,
            contacts,
            remark
        }: SuppliesRequirement
    ) {
        return (
            <SessionBox>
                <h2>医用物资需求发布</h2>

                <form onChange={this.changeText} onSubmit={this.handleSubmit}>
                    <FormField
                        name="hospital"
                        required
                        defaultValue={hospital}
                        label="医疗机构"
                        placeholder="可详细至分院、院区、科室"
                        onChange={this.updateText}
                    />
                    <FormField label="机构地址">
                        <AddressField
                            place={hospital}
                            {...{ province, city, district, address }}
                            onChange={this.changeAddress}
                        />
                    </FormField>

                    <FormField
                        type="url"
                        name="url"
                        required
                        defaultValue={url}
                        label="官方网址"
                    />
                    <SuppliesField
                        list={supplies}
                        onChange={({ detail }: CustomEvent) =>
                            (this.state.supplies = detail)
                        }
                    />
                    <ContactField
                        list={contacts}
                        onChange={({ detail }: CustomEvent) =>
                            (this.state.contacts = detail)
                        }
                    />
                    <FormField
                        is="textarea"
                        name="remark"
                        label="备注"
                        defaultValue={remark}
                    />
                    <div className="form-group mt-3">
                        <Button
                            type="submit"
                            block
                            disabled={suppliesRequirement.loading}
                        >
                            提交
                        </Button>
                        <Button
                            type="reset"
                            color="danger"
                            block
                            onClick={() => history.push(RouteRoot.Hospital)}
                        >
                            取消
                        </Button>
                    </div>
                </form>
            </SessionBox>
        );
    }
}
