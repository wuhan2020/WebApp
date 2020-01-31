import { observable } from 'mobx';
import { service, DataItem, User, PageData, Place } from './HTTPService';
import { Contact } from './HTTPService';

export interface HotelCanStaying extends DataItem, Place {
    name?: string;
    address?: string;
    capacity?: number;
    contacts?: Contact[];
    creator?: User;
    url?: string;
}

export class HotelCanStayingModel {
    @observable
    pageIndex = 0;

    pageSize = 10;

    totalCount = 0;

    @observable
    list = [];

    async getNextPage() {
        if (this.pageIndex && this.list.length === this.totalCount) return;
        const {
            body: { count, data }
        } = await service.get<PageData<HotelCanStaying[]>>(
            '/hotel?' +
                new URLSearchParams({
                    pageIndex: this.pageIndex + 1 + '',
                    pageSize: this.pageSize + ''
                })
        );
        this.pageIndex++, (this.totalCount = count);
        this.list = this.list.concat(data);
        return data;
    }

    update(data: HotelCanStaying, id?: string) {
        return id
            ? service.put('/hotel/' + id, data)
            : service.post('/hotel', data);
    }

    async delete(id: string) {
        await service.delete('/hotel/' + id);
        this.list = this.list.filter(({ objectId }) => objectId !== id);
    }

    async getOne(id: string) {
        const { body } = await service.get<HotelCanStaying>('/hotel/' + id);
        return body;
    }
}
