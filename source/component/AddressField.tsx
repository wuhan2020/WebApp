import {
    component,
    mixin,
    attribute,
    watch,
    createCell,
    Fragment
} from 'web-cell';

import { searchAddress } from '../model';

interface AddressFieldProps {
    place?: string;
    province: string;
    city: string;
    district: string;
    address: string;
    latitude?: number;
    longitude?: number;
}

interface AddressFieldState {
    loading?: boolean;
}

@component({
    tagName: 'address-field',
    renderTarget: 'children'
})
export class AddressField extends mixin<
    AddressFieldProps,
    AddressFieldState
>() {
    @attribute
    set place(value: string) {
        if ((this.props.place = value)) this.search(value);
    }

    @attribute
    @watch
    province = '';

    @attribute
    @watch
    city = '';

    @attribute
    @watch
    district = '';

    @attribute
    @watch
    address = '';

    state = { loading: false };

    search = async (place: string) => {
        await this.setState({ loading: true });

        try {
            const [
                { pname, cityname, adname, address, location }
            ] = await searchAddress(place);

            const [longitude, latitude] = location.split(',').map(Number);

            await this.setProps({
                province: pname,
                city: cityname,
                district: adname,
                address,
                latitude,
                longitude
            });

            this.emit('change', this.props);
        } finally {
            await this.setState({ loading: false });
        }
    };

    connectedCallback() {
        this.classList.add('input-group');
    }

    emitChange = (event: Event) => {
        event.stopPropagation();

        const { name, value } = event.target as HTMLInputElement;

        this.props[name] = value;

        this.emit('change', this.props);
    };

    render(
        { province, city, district, address }: AddressFieldProps,
        { loading }: AddressFieldState
    ) {
        return (
            <Fragment>
                <input
                    type="text"
                    className="form-control"
                    name="province"
                    required
                    defaultValue={province}
                    placeholder="省/直辖市/自治区/特别行政区"
                    disabled={loading}
                    onChange={this.emitChange}
                />
                <input
                    type="text"
                    className="form-control"
                    name="city"
                    required
                    defaultValue={city}
                    placeholder="地级市/自治州"
                    disabled={loading}
                    onChange={this.emitChange}
                />
                <input
                    type="text"
                    className="form-control"
                    name="district"
                    required
                    defaultValue={district}
                    placeholder="区/县/县级市"
                    disabled={loading}
                    onChange={this.emitChange}
                />
                <input
                    type="text"
                    className="form-control"
                    name="address"
                    required
                    defaultValue={address}
                    placeholder="详细地址"
                    disabled={loading}
                    onChange={this.emitChange}
                />
            </Fragment>
        );
    }
}
