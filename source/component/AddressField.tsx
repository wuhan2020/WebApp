import {
    WebCellProps,
    component,
    WebCell,
    attribute,
    observer,
    reaction
} from 'web-cell';
import { observable } from 'mobx';
import { FormControl } from 'boot-cell';

import { Address, GeoCoord, searchAddress, coordsOf } from '../service';

export interface AddressFieldProps
    extends Address,
        Partial<GeoCoord>,
        WebCellProps<HTMLInputElement> {
    place?: string;
}

export interface AddressField extends WebCell<AddressFieldProps> {}

@component({ tagName: 'address-field' })
@observer
export class AddressField
    extends HTMLElement
    implements WebCell<AddressFieldProps>
{
    @attribute
    @observable
    accessor place: string;

    @reaction(({ place }) => place)
    handlePlace(value: string) {
        if (value) this.search(value);
    }

    @attribute
    @observable
    accessor province = '';

    @attribute
    @observable
    accessor city = '';

    @attribute
    @observable
    accessor district = '';

    @attribute
    @observable
    accessor address = '';

    @attribute
    @observable
    accessor latitude: number;

    @attribute
    @observable
    accessor longitude: number;

    @observable
    accessor loading = false;

    emitData() {
        const { place, province, city, district, address } = this;

        this.emit('change', { place, province, city, district, address });
    }

    search = async (place: string) => {
        this.loading = true;

        try {
            const list = await searchAddress(place);

            if (!list[0]) return;

            const { pname, cityname, adname, address, location } = list[0];

            const [longitude, latitude] = location.split(',').map(Number);

            Object.assign(this, {
                province: pname,
                city: cityname,
                district: adname,
                address,
                latitude,
                longitude
            });

            this.emitData();
        } finally {
            this.loading = false;
        }
    };

    mountedCallback() {
        this.classList.add('input-group');
    }

    emitChange = async (event: Event) => {
        event.stopPropagation();

        const { name, value } = event.target as HTMLInputElement;

        this[name] = value;

        const { province, city, district, address } = this;

        const [{ latitude, longitude }] = await coordsOf(
            province + city + district + address
        );
        this.latitude = latitude;
        this.longitude = longitude;

        this.emitData();
    };

    render() {
        const { province, city, district, address, loading } = this;

        return (
            <>
                <FormControl
                    name="province"
                    required
                    defaultValue={province}
                    placeholder="省/直辖市/自治区/特别行政区"
                    disabled={loading}
                    onChange={this.emitChange}
                />
                <FormControl
                    name="city"
                    required
                    defaultValue={city}
                    placeholder="地级市/自治州"
                    disabled={loading}
                    onChange={this.emitChange}
                />
                <FormControl
                    name="district"
                    required
                    defaultValue={district}
                    placeholder="区/县/县级市"
                    disabled={loading}
                    onChange={this.emitChange}
                />
                <FormControl
                    name="address"
                    required
                    defaultValue={address}
                    placeholder="详细地址"
                    disabled={loading}
                    onChange={this.emitChange}
                />
            </>
        );
    }
}
