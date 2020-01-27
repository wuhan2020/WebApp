import { component, mixin, watch, createCell } from 'web-cell';
import { FormField } from 'boot-cell/source/Form/FormField';
import { Button } from 'boot-cell/source/Form/Button';

import { RouteRoot } from '../menu';
import {
    SuppliesRequirement,
    searchAddress,
    suppliesRequirement,
    history
} from '../../model';
import { SessionBox } from '../../component';

@component({
    tagName: 'hospital-edit',
    renderTarget: 'children'
})
export class HospitalEdit extends mixin<
    { srid: string },
    SuppliesRequirement
>() {
    @watch
    srid = '';

    state = {
        hospital: '',
        address: '',
        coords: [],
        supplies: [''],
        contacts: [{ name: '', number: '' }]
    };

    async connectedCallback() {
        super.connectedCallback();

        if (!this.srid) return;

        const {
            hospital,
            address,
            coords,
            supplies,
            contacts
        } = await suppliesRequirement.getOne(this.srid);

        this.setState({ hospital, address, coords, supplies, contacts });
    }

    changeText = ({ target }: Event) => {
        const { name, value } = target as HTMLInputElement;

        this.state[name] = value;
    };

    searchAddress = async ({ target }: Event) => {
        const { value } = target as HTMLInputElement;

        const [
            { pname, cityname, adname, address, location }
        ] = await searchAddress(value);

        await this.setState({
            address: pname + cityname + adname + address,
            coords: location.split(',').map(Number)
        });
    };

    changeSupply(index: number, event: Event) {
        event.stopPropagation();

        const { value } = event.target as HTMLInputElement;

        this.state.supplies[index] = value;
    }

    addSupply = () => this.setState({ supplies: [...this.state.supplies, ''] });

    deleteSupply(index: number) {
        const { supplies } = this.state;

        supplies.splice(index, 1);

        this.setState({ supplies });
    }

    changeContact(index: number, event: Event) {
        event.stopPropagation();

        const { name, value } = event.target as HTMLInputElement;

        this.state.contacts[index][name] = value;
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

        await suppliesRequirement.update(this.state, this.srid);

        self.alert('发布成功！');

        history.push(RouteRoot.Hospital);
    };

    render(_, { hospital, address, supplies, contacts }: SuppliesRequirement) {
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
                    <FormField
                        name="address"
                        required
                        defaultValue={address}
                        label="机构地址"
                        placeholder="先填上一项可自动搜索"
                    />
                    <FormField label="物资列表">
                        {supplies.map((item, index) => (
                            <div
                                className="input-group my-1"
                                onChange={(event: Event) =>
                                    this.changeSupply(index, event)
                                }
                            >
                                <input
                                    type="text"
                                    className="form-control"
                                    name="supplies"
                                    value={item}
                                    placeholder="物资名称"
                                />
                                <div className="input-group-append">
                                    <Button onClick={this.addSupply}>+</Button>
                                    <Button
                                        kind="danger"
                                        disabled={supplies.length < 2}
                                        onClick={() => this.deleteSupply(index)}
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

                    <div className="form-group mt-3">
                        <Button type="submit" block>
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
