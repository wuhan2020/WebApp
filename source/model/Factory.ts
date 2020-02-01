import { observable } from 'mobx';
import { DataItem, Contact, User, Place, service, PageData } from '../service';
import { Supplies } from './SuppliesRequirement';

export interface Factory extends DataItem, Place {
    name?: string;
    qualification?: string;
    category?: string;
    capability?: string;
    supplies?: Supplies[];
    contacts?: Contact[];
    creator?: User;
    url?: string;
    remark?: string;
}

export class FactoryService {
    @observable
    pageIndex = 0;

    pageSize = 10;

    totalCount = 0;

    @observable
    list: Factory[] = [];

    constructor() {}
    async getNextPage() {
        if (this.pageIndex && this.list.length === this.totalCount) return;

        const {
            body: { count, data }
        } = await service.get<PageData<Factory>>(
            '/vendor?' +
                new URLSearchParams({
                    pageIndex: this.pageIndex + 1 + '',
                    pageSize: this.pageSize + ''
                })
        );
        this.pageIndex++, (this.totalCount = count);
        console.log(data);

        this.list = this.list.concat(data);

        return data;
    }

    async update(data: Factory, id?: string) {
        if (!id) {
            const { body } = await service.post<Factory>('/vendor', data);

            this.list = [body].concat(this.list);
        } else {
            const { body } = await service.put<Factory>('/vendor/' + id, data),
                index = this.list.findIndex(({ objectId }) => objectId === id);

            this.list[index] = body;
        }
    }

    async getOne(id: string) {
        const { body } = await service.get<Factory>('/vendor/' + id);
        return body;
    }

    async delete(id: string) {
        await service.delete('/vendor/' + id);

        this.list = this.list.filter(({ objectId }) => objectId !== id);
    }
}
