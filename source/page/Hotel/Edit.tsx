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
            province,
            city,
            district,
            contacts,
            capacity,
            coords,
            url
        } = await hotel.getOne(this.srid);

        this.setState({
            name,
            address,
            province,
            city,
            district,
            contacts,
            capacity,
            coords,
            url
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

    changeAddress = (event: CustomEvent) => {
        const { latitude, longitude, ...rest } = event.detail;

        Object.assign(this.state, {
            ...rest,
            coords: { latitude, longitude }
        });
    };

    handleSubmit = async (event: Event) => {
        event.preventDefault();

        await this.setState({ loading: true });

        const params = { ...this.state };
        params.capacity *= 1;

        try {
            await hotel.update(params, this.srid);

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
            address,
            capacity,
            contacts,
            url,
            province,
            city,
            district,
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
                        onChange={(event: CustomEvent) =>
                            (this.state.contacts = event.detail)
                        }
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
