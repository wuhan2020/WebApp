import { component, mixin, watch, createCell } from 'web-cell';
import { FormField } from 'boot-cell/source/Form/FormField';
import { Button } from 'boot-cell/source/Form/Button';

import { mergeList } from '../../utility';
import { GeoCoord, Contact } from '../../service';
import { history, Supplies, factory, Factory } from '../../model';
import { RouteRoot } from '../menu';
import CommonSupplies from '../Hospital/Supplies';
import {
    SessionBox,
    AddressField,
    SuppliesField,
    ContactField
} from '../../component';

@component({
    tagName: 'factory-edit',
    renderTarget: 'children'
})
export class FactoryEdit extends mixin<{ dataId: string }, Factory>() {
    @watch
    dataId = '';

    state = {
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
    };

    async connectedCallback() {
        super.connectedCallback();

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

        this.setState({
            name,
            qualification,
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

        const { supplies, ...data } = this.state;

        await factory.update(
            { ...data, supplies: supplies.filter(({ count }) => count) },
            this.dataId
        );
        self.alert('发布成功！');

        history.push(RouteRoot.Factory);
    };

    render(
        _,
        {
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
        }: Factory
    ) {
        return (
            <SessionBox>
                <h2>生产厂商发布</h2>

                <form onChange={this.changeText} onSubmit={this.handleSubmit}>
                    <FormField
                        name="name"
                        required
                        defaultValue={name}
                        label="厂商名字"
                        onChange={this.updateText}
                    />
                    <FormField label="机构地址">
                        <AddressField
                            place={name}
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
                    <FormField
                        name="qualification"
                        required
                        defaultValue={qualification}
                        label="资质证明"
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
                        <Button type="submit" block disabled={factory.loading}>
                            提交
                        </Button>
                        <Button
                            type="reset"
                            kind="danger"
                            block
                            onClick={() => history.push(RouteRoot.Factory)}
                        >
                            取消
                        </Button>
                    </div>
                </form>
            </SessionBox>
        );
    }
}
