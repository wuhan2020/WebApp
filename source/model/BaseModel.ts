import { observable } from 'mobx';
import { DataItem, service, PageData } from '../service';

export abstract class BaseModel<T extends DataItem> {
    pageIndex = 0;

    pageSize = 10;

    totalCount = 0;

    @observable
    list: T[] = [];

    abstract baseURI: string;

    async getNextPage<F = {}>(filter?: F) {
        if (this.pageIndex && this.list.length === this.totalCount) return;

        const {
            body: { count, data }
        } = await service.get<PageData<T>>(
            `${this.baseURI}?${new URLSearchParams({
                ...filter,
                pageIndex: this.pageIndex + 1 + '',
                pageSize: this.pageSize + ''
            })}`
        );
        this.pageIndex++, (this.totalCount = count);

        this.list = this.list.concat(data);

        if (data[0]) return data;
    }

    async update(data: T, id?: string) {
        if (!id) {
            const { body } = await service.post<T>(this.baseURI, data);

            this.list = [body].concat(this.list);
        } else {
            const { body } = await service.put<T>(this.baseURI + id, data),
                index = this.list.findIndex(({ objectId }) => objectId === id);

            this.list[index] = body;
        }
    }

    async getOne(id: string) {
        const { body } = await service.get<T>(this.baseURI + id);

        return body;
    }

    async delete(id: string) {
        await service.delete(this.baseURI + id);

        this.list = this.list.filter(({ objectId }) => objectId !== id);
    }
}
