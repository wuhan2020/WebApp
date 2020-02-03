import { component, mixin, watch, createCell } from 'web-cell';
import { FormField } from 'boot-cell/source/Form/FormField';
import { Button } from 'boot-cell/source/Form/Button';

import { RouteRoot } from '../menu';
import { Hotel, hotel, history } from '../../model';
import { GeoCoord, Contact } from '../../service';
import { SessionBox, AddressField, ContactField } from '../../component';

type HotelEditState = Hotel & { loading?: boolean };

@component({
    tagName: 'hotel-edit',
    renderTarget: 'children'
})
export class HotelEdit extends mixin<{ srid: string }, HotelEditState>() {
    @watch
    srid = '';

    state = {
        loading: false,
        name: '',
        capacity: 0,
        province: '',
        city: '',
        district: '',
        address: '',
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
            capacity,
            province,
            city,
            district,
            address,
            coords,
            url,
            contacts,
            remark
        } = await hotel.getOne(this.srid);

        this.setState({
            name,
            capacity,
            province,
            city,
            district,
            address,
            coords,
            url,
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

        await this.setState({ loading: true });

        const { loading, ...data } = this.state;
        data.capacity *= 1;

        try {
            await hotel.update(data, this.srid);

            self.alert('发布成功！');

            history.push(RouteRoot.Hotel);
        } finally {
            await this.setState({ loading: false });
        }
    };

    render(
        _,
        {
            name,
            province,
            city,
            district,
            address,
            capacity,
            contacts,
            url,
            remark,
            loading
        }: HotelEditState
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
                        onChange={this.updateText}
                    />
                    <FormField label="酒店地址">
                        <AddressField
                            place={name}
                            {...{ province, city, district, address }}
                            onChange={this.changeAddress}
                        />
                    </FormField>

                    <FormField
                        type="number"
                        name="capacity"
                        required
                        defaultValue={capacity + ''}
                        label="可接待人数"
                    />
                    <FormField
                        type="url"
                        name="url"
                        required
                        defaultValue={url}
                        label="信息来源网址"
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
                        defaultValue={remark}
                        label="备注"
                    />
                    <div className="form-group mt-3">
                        <Button type="submit" block disabled={loading}>
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
