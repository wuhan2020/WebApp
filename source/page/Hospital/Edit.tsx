import { component, mixin, watch, createCell } from 'web-cell';
import { FormField } from 'boot-cell/source/Form/FormField';
import { Button } from 'boot-cell/source/Form/Button';

import { mergeList } from '../../utility';
import { RouteRoot } from '../menu';
import CommonSupplies from './Supplies';
import {
    SuppliesRequirement,
    Address,
    Supplies,
    Contact,
    searchAddress,
    suppliesRequirement,
    history
} from '../../model';
import { SessionBox } from '../../component';

type HospitalEditProps = SuppliesRequirement & { loading?: boolean };

@component({
    tagName: 'hospital-edit',
    renderTarget: 'children'
})
export class HospitalEdit extends mixin<{ srid: string }, HospitalEditProps>() {
    @watch
    srid = '';

    state = {
        loading: false,
        hospital: '',
        address: {} as Address,
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
            hospital,
            address,
            url,
            supplies,
            contacts,
            remark
        } = await suppliesRequirement.getOne(this.srid);

        this.setState({
            loading: false,
            hospital,
            address,
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

            await this.setState({
                loading: false,
                address: {
                    province: pname,
                    city: cityname,
                    district: adname,
                    detail: address,
                    coords: location.split(',').map(Number)
                }
            });
        } catch {
            await this.setState({ loading: false });
        }
    };

    changeListItem(
        key: keyof SuppliesRequirement,
        index: number,
        event: Event
    ) {
        event.stopPropagation();

        const { name, value } = event.target as HTMLInputElement;

        this.state[key][index][name] = value;
    }

    addSupply = () => this.setState({ supplies: [...this.state.supplies, {}] });

    deleteListItem(key: keyof SuppliesRequirement, index: number) {
        const list = this.state[key];

        list.splice(index, 1);

        this.setState({ [key]: list });
    }

    addContact = () =>
        this.setState({
            contacts: [...this.state.contacts, { name: '', number: '' }]
        });

    handleSubmit = async (event: Event) => {
        event.preventDefault();

        await this.setState({ loading: true });

        const { loading, supplies, ...data } = { ...this.state };

        try {
            await suppliesRequirement.update(
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
            hospital,
            address: { province, city, district, detail },
            url,
            supplies,
            contacts,
            loading
        }: HospitalEditProps
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
                                name="detail"
                                required
                                defaultValue={detail}
                                placeholder="详细地址"
                            />
                        </div>
                    </FormField>

                    <FormField
                        type="url"
                        name="url"
                        required
                        defaultValue={url}
                        label="官方网址"
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
                                    this.changeListItem(
                                        'contacts',
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
                                            this.deleteListItem(
                                                'contacts',
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

                    <div className="form-group mt-3">
                        <Button type="submit" block disabled={loading}>
                            提交
                        </Button>
                        <Button
                            type="reset"
                            kind="danger"
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
