import { observable } from 'mobx';

import { DataItem, Contact, service, PageData } from './HTTPService';

export interface ServiceArea {
    city: string;
    direction: 'in' | 'out' | 'both';
    personal: boolean;
}

export interface Logistics extends DataItem {
    name?: string;
    url?: string;
    contacts?: Contact[];
    serviceArea?: ServiceArea[];
    remark?: string;
}

export class LogisticsModel {
    @observable
    pageIndex = 0;

    pageSize = 10;

    totalCount = 0;

    @observable
    list: Logistics[] = [];

    async getNextPage() {
        if (this.pageIndex && this.list.length === this.totalCount) return;

        const {
            body: { count, data }
        } = await service.get<PageData<Logistics>>(
            '/logistics?' +
                new URLSearchParams({
                    pageIndex: this.pageIndex + 1 + '',
                    pageSize: this.pageSize + ''
                })
        );
        this.pageIndex++, (this.totalCount = count);

        this.list = this.list.concat(data);

        return data;
    }

    async update(data: Logistics, id?: string) {
        if (!id) {
            const { body } = await service.post<Logistics>('/logistics', data);

            this.list = [body].concat(this.list);
        } else {
            const { body } = await service.put<Logistics>(
                    '/logistics/' + id,
                    data
                ),
                index = this.list.findIndex(({ objectId }) => objectId === id);

            this.list[index] = body;
        }
    }

    async getOne(id: string) {
        const { body } = await service.get<Logistics>('/logistics/' + id);

        return body;
    }

    async delete(id: string) {
        await service.delete('/logistics/' + id);

        this.list = this.list.filter(({ objectId }) => objectId !== id);
    }
}
