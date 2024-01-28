import { WebCell, component, attribute, observer } from 'web-cell';
import { FormGroup, FormLabel, FormField, Button } from 'boot-cell';
import { observable } from 'mobx';

import { RouteRoot } from '../data/menu';
import { Hotel, hotel } from '../../model';
import { GeoCoord, Contact } from '../../service';
import { SessionBox, AddressField, ContactField } from '../../component';

export interface HotelEditProps {
    dataId: string;
}

export interface HotelEdit extends WebCell<HotelEditProps> {}

@component({ tagName: 'hotel-edit' })
@observer
export class HotelEdit extends HTMLElement implements WebCell<HotelEditProps> {
    @attribute
    @observable
    accessor dataId = '';

    @observable
    accessor state = {
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
    } as Hotel;

    async connectedCallback() {
        if (!this.dataId) return;

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
        } = await hotel.getOne(this.dataId);

        this.state = {
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
        };
    }

    changeText = ({ target }: Event) => {
        const { name, value } = target as HTMLInputElement;

        this.state = { ...this.state, [name]: value };
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

        const { capacity, contacts, ...data } = this.state;

        await hotel.update(
            {
                ...data,
                capacity: +capacity,
                contacts: contacts.filter(
                    ({ name, phone }) => name?.trim() && phone?.trim()
                )
            },
            this.dataId
        );

        self.alert('提交成功，工作人员审核后即可查看');

        location.hash = RouteRoot.Hotel;
    };

    render() {
        const {
            name,
            province,
            city,
            district,
            address,
            capacity,
            contacts,
            url,
            remark
        } = this.state;

        return (
            <SessionBox>
                <h1>发布住宿信息</h1>
                {/* @ts-ignore */}
                <form onChange={this.changeText} onSubmit={this.handleSubmit}>
                    <FormField
                        name="name"
                        required
                        defaultValue={name}
                        label="酒店"
                        placeholder="酒店名称"
                    />
                    <FormGroup>
                        <FormLabel>酒店地址</FormLabel>
                        <AddressField
                            place={name}
                            {...{ province, city, district, address }}
                            onChange={this.changeAddress}
                        />
                    </FormGroup>

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
                        as="textarea"
                        name="remark"
                        defaultValue={remark}
                        label="备注"
                    />
                    <div className="form-group mt-3">
                        <Button
                            type="submit"
                            variant="primary"
                            className="d-block"
                            disabled={hotel.loading}
                        >
                            提交
                        </Button>
                        <Button
                            type="reset"
                            variant="danger"
                            className="d-block"
                            onClick={() => (location.hash = RouteRoot.Hotel)}
                        >
                            取消
                        </Button>
                    </div>
                </form>
            </SessionBox>
        );
    }
}
