import { observable } from 'mobx';

import { DataItem, Contact, service, PageData } from './HTTPService';

export interface Clinic extends DataItem {
    name?: string;
    url?: string;
    contacts?: Contact;
    time?: string;
}

export class ClinicModel {
    @observable
    pageIndex = 0;

    pageSize = 10;

    totalCount = 0;

    @observable
    list: Clinic[] = [];

    async getNextPage() {
        if (this.pageIndex && this.list.length === this.totalCount) return;

        const {
            body: { count, data }
        } = await service.get<PageData<Clinic>>(
            '/clinic?' +
            new URLSearchParams({
                pageIndex: this.pageIndex + 1 + '',
                pageSize: this.pageSize + ''
            })
        );
        this.pageIndex++, (this.totalCount = count);

        this.list = this.list.concat(data);

        return data;
    }

    async update(data: Clinic, id?: string) {
        if (!id) {
            const { body } = await service.post<Clinic>('/clinic', data);

            this.list = [body].concat(this.list);
        } else {
            const { body } = await service.put<Clinic>(
                '/clinic/' + id,
                data
                ),
                index = this.list.findIndex(({ objectId }) => objectId === id);

            this.list[index] = body;
        }
    }

    async getOne(id: string) {
        const { body } = await service.get<Clinic>('/clinic/' + id);

        return body;
    }

    async delete(id: string) {
        await service.delete('/clinic/' + id);

        this.list = this.list.filter(({ objectId }) => objectId !== id);
    }
}
