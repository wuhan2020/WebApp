import { component, mixin, watch, createCell } from 'web-cell';
import { FormField } from 'boot-cell/source/Form/FormField';
import { Button } from 'boot-cell/source/Form/Button';

import { RouteRoot } from '../menu';
import {
    searchAddress,
    HotelCanStaying,
    hotelCanStaying,
    history,
    GeoCoord,
    Contact
} from '../../model';
import { SessionBox } from '../../component';

type HotelCanStayingEditProps = HotelCanStaying & { loading?: boolean };

@component({
    tagName: 'hotel-edit',
    renderTarget: 'children'
})
export class HotelEdit extends mixin<
    { srid: string },
    HotelCanStayingEditProps
>() {
    @watch
    srid = '';

    state = {
        name: '',
        address: '',
        capacity: 0,
        loading: false,
        province: '',
        city: '',
        district: '',
        coords: {} as GeoCoord,
        url: '',
        contacts: [{} as Contact],
        remark: ''
    };

    async connectedCallback() {
        super.connectedCallback();
        if (!this.srid) return;
        const {
            name,
            address,
            coords,
            contacts,
            capacity
        } = await hotelCanStaying.getOne(this.srid);

        this.setState({ name, address, coords, contacts, capacity });
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
        const params = { ...this.state };
        params.capacity *= 1;
        await hotelCanStaying.update(params, this.srid);
        self.alert('发布成功！');
        history.push(RouteRoot.Hotel);
    };

    render(
        _,
        {
            name,
            address,
            capacity,
            contacts,
            url,
            province,
            city,
            district
        }: HotelCanStaying
    ) {
        return (
            <SessionBox>
                <h2>发布住宿信息</h2>
                <form onChange={this.changeText} onSubmit={this.handleSubmit}>
                    <FormField
                        name="name"
                        required
                        defaultValue={name}
                        label="酒店"
                        placeholder="酒店名称"
                        onChange={this.searchAddress}
                    />
                    <FormField label="酒店地址">
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

                    <FormField label="可接待人数">
                        <input
                            type="number"
                            className="form-control"
                            name="capacity"
                            required
                            defaultValue={capacity}
                            placeholder="可接待人数"
                        />
                    </FormField>

                    <FormField
                        type="url"
                        name="url"
                        required
                        defaultValue={url}
                        label="信息来源网址"
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
