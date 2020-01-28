import { component, mixin, watch, createCell } from 'web-cell';
import { FormField } from 'boot-cell/source/Form/FormField';
import { Button } from 'boot-cell/source/Form/Button';

import { RouteRoot } from '../menu';
import {
    searchAddress,
    HotelCanStaying,
    hotelCanStaying,
    history
} from '../../model';
import { SessionBox } from '../../component';

@component({
    tagName: 'hotel-edit',
    renderTarget: 'children'
})
export class HotelEdit extends mixin<{ srid: string }, HotelCanStaying>() {
    @watch
    srid = '';

    state = {
        hotel: '',
        address: '',
        capacity: '',
        coords: [],
        contacts: [{ name: '', number: '' }]
    };

    async connectedCallback() {
        super.connectedCallback();
        if (!this.srid) return;
        const {
            hotel,
            address,
            coords,
            contacts,
            capacity
        } = await hotelCanStaying.getOne(this.srid);

        this.setState({ hotel, address, coords, contacts, capacity });
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

    changeContact = (index: number, event: Event) => {
        event.stopPropagation();
        const { name, value } = event.target as HTMLInputElement;
        this.state.contacts[index][name] = value;
    };

    addContact = () => {
        this.setState({
            contacts: [...this.state.contacts, { name: '', number: '' }]
        });
    };

    deleteContact = (index: number) => {
        const { contacts } = this.state;
        contacts.splice(index, 1);
        this.setState({ contacts });
    };

    handleSubmit = async (event: Event) => {
        event.preventDefault();
        await hotelCanStaying.update(this.state, this.srid);
        self.alert('发布成功！');
        history.push(RouteRoot.Hotel);
    };

    render(_, { hotel, address, capacity, contacts }: HotelCanStaying) {
        return (
            <SessionBox>
                <h2>发布住宿信息</h2>
                <form onChange={this.changeText} onSubmit={this.handleSubmit}>
                    <FormField
                        name="hotel"
                        required
                        defaultValue={hotel}
                        label="酒店"
                        placeholder="酒店名称"
                        onChange={this.searchAddress}
                    />
                    <FormField
                        name="address"
                        required
                        defaultValue={address}
                        label="酒店地址"
                        placeholder="先填上一项可自动搜索"
                    />
                    <FormField
                        name="capacity"
                        required
                        defaultValue={capacity}
                        label="可接待人数"
                        placeholder="可接待人数"
                    />

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
                                    placeholder="电话号码（不含 +86 和区号的先导）"
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
                            onClick={() => history.push(RouteRoot.Hotel)}
                        >
                            取消
                        </Button>
                    </div>
                </form>
            </SessionBox>
        );
    }
}
