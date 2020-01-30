import { component, mixin, watch, createCell } from 'web-cell';
import { FormField } from 'boot-cell/source/Form/FormField';
import { Button } from 'boot-cell/source/Form/Button';

import { RouteRoot } from '../menu';
import {
    searchAddress,
    suppliesRequirement,
    history,
    FactoryStore,
    Factory,
    GeoCoord,
    Contact,
    Supplies
} from '../../model';
import CommonSupplies from '../Hospital/Supplies';
import { SessionBox } from '../../component';
import { mergeList } from '../../utility';

type FactoryEditProps = Factory & { loading?: boolean };

@component({
    tagName: 'factory-edit',
    renderTarget: 'children'
})
export class FactoryEdit extends mixin<{ srid: string }, FactoryEditProps>() {
    @watch
    srid = '';

    state = {
        loading: false,
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

        if (!this.srid) return;

        await this.setState({ loading: true });

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
        } = await FactoryStore.getOne(this.srid);

        this.setState({
            loading: false,
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

    searchAddress = async ({ target }: Event) => {
        const { value } = target as HTMLInputElement;

        await this.setState({ loading: true });

        try {
            const [
                { pname, cityname, adname, address, location }
            ] = await searchAddress(value);

            const [longitude, latitude] = location.split(',').map(Number);

            await this.setState({
                loading: false,
                province: pname,
                city: cityname,
                district: adname,
                address,
                coords: { latitude, longitude }
            });
        } catch {
            await this.setState({ loading: false });
        }
    };

    addSupply = () => this.setState({ supplies: [...this.state.supplies, {}] });

    changeContact(index: number, event: Event) {
        event.stopPropagation();

        const { name, value } = event.target as HTMLInputElement;

        this.state.contacts[index][name] = value;
    }

    deleteListItem(key: keyof Factory, index: number) {
        const list = this.state[key];

        list.splice(index, 1);

        this.setState({ [key]: list });
    }

    changeListItem(key: keyof Factory, index: number, event: Event) {
        event.stopPropagation();

        const { name, value } = event.target as HTMLInputElement;

        this.state[key][index][name] = value;
    }

    addContact = () =>
        this.setState({
            contacts: [...this.state.contacts, { name: '', number: '' }]
        });

    deleteContact(index: number) {
        const { contacts } = this.state;

        contacts.splice(index, 1);

        this.setState({ contacts });
    }

    handleSubmit = async (event: Event) => {
        event.preventDefault();

        await this.setState({ loading: true });

        const { loading, supplies, ...data } = { ...this.state };

        try {
            await FactoryStore.update(
                { ...data, supplies: supplies.filter(({ count }) => count) },
                this.srid
            );
            self.alert('发布成功！');

            history.push(RouteRoot.Hospital);
        } finally {
            await this.setState({ loading: false });
        }
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
            remark,
            loading
        }: FactoryEditProps
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
                        onChange={this.searchAddress}
                    />
                    <FormField label="机构地址">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                name="province"
                                required
                                defaultValue={province}
                                placeholder="省/直辖市/自治区/特别行政区"
                            />
                            <input
                                type="text"
                                className="form-control"
                                name="city"
                                required
                                defaultValue={city}
                                placeholder="地级市/自治州"
                            />
                            <input
                                type="text"
                                className="form-control"
                                name="district"
                                required
                                defaultValue={district}
                                placeholder="区/县/县级市"
                            />
                            <input
                                type="text"
                                className="form-control"
                                name="address"
                                required
                                defaultValue={address}
                                placeholder="详细地址"
                            />
                        </div>
                    </FormField>

                    <FormField
                        name="qualification"
                        required
                        defaultValue={qualification}
                        label="资质证明"
                    />
                    <FormField label="物资列表">
                        {supplies.map(({ name, count, remark }, index) => (
                            <div
                                className="input-group my-1"
                                onChange={(event: Event) =>
                                    this.changeListItem(
                                        'supplies',
                                        index,
                                        event
                                    )
                                }
                            >
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={name}
                                    placeholder="名称"
                                />
                                <input
                                    type="number"
                                    className="form-control"
                                    name="count"
                                    defaultValue="0"
                                    value={count}
                                    placeholder="数量"
                                />
                                <input
                                    type="text"
                                    className="form-control"
                                    name="remark"
                                    value={remark}
                                    placeholder="备注"
                                />
                                <div className="input-group-append">
                                    <Button onClick={this.addSupply}>+</Button>
                                    <Button
                                        kind="danger"
                                        disabled={supplies.length < 2}
                                        onClick={() =>
                                            this.deleteListItem(
                                                'supplies',
                                                index
                                            )
                                        }
                                    >
                                        -
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </FormField>

                    <FormField label="联系方式">
                        {contacts.map(({ name, number }, index) => (
                            <div
                                className="input-group my-1"
                                onChange={(event: Event) =>
                                    this.changeContact(index, event)
                                }
                            >
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={name}
                                    placeholder="姓名"
                                />
                                <input
                                    type="tel"
                                    className="form-control"
                                    name="number"
                                    value={number}
                                    placeholder="电话号码（不含 +86 和区号的先导 0）"
                                />
                                <div className="input-group-append">
                                    <Button onClick={this.addContact}>+</Button>
                                    <Button
                                        kind="danger"
                                        disabled={!contacts[1]}
                                        onClick={() =>
                                            this.deleteContact(index)
                                        }
                                    >
                                        -
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </FormField>

                    <FormField
                        is="textarea"
                        name="remark"
                        label="备注"
                        defaultValue={remark}
                    />

                    <FormField
                        name="url"
                        required
                        defaultValue={url}
                        label="信息发布源链接"
                    />

                    <div className="form-group mt-3">
                        <Button type="submit" block disabled={loading}>
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
