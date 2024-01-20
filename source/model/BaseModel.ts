import { observable } from 'mobx';

import { DataItem, service, PageData, User } from '../service';
import { session } from '.';

export abstract class BaseModel<T extends DataItem = {}, F = {}> {
    @observable
    accessor loading = false;

    @observable
    accessor noMore = false;

    pageIndex = 0;

    pageSize = 10;

    totalCount = 0;

    @observable
    accessor list: T[] = [];

    abstract baseURI: string;

    reset() {
        this.loading = this.noMore = false;

        this.list.length = this.pageIndex = this.totalCount = 0;
    }

    async getNextPage(filter: F, reset?: boolean) {
        if (reset) this.reset();

        if (this.loading || this.noMore) return;

        if (this.pageIndex && this.list.length === this.totalCount) {
            this.noMore = true;
            return;
        }

        this.loading = true;

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

        this.loading = false;

        if (data[0]) return data;

        this.noMore = true;
    }

    async update(data: T, id?: string) {
        this.loading = true;

        if (!id) {
            const { body } = await service.post<T>(this.baseURI, data);

            this.list = [body].concat(this.list);
        } else {
            const { body } = await service.put<T>(this.baseURI + id, data),
                index = this.list.findIndex(({ objectId }) => objectId === id);

            this.list[index] = body;
        }

        this.loading = false;
    }

    async getOne(id: string) {
        this.loading = true;

        const { body } = await service.get<T>(this.baseURI + id);

        this.loading = false;

        return body;
    }

    async delete(id: string) {
        this.loading = true;

        await service.delete(this.baseURI + id);

        this.list = this.list.filter(({ objectId }) => objectId !== id);

        this.loading = false;
    }
}

export interface VerifiableData extends DataItem {
    verified?: boolean;
    verifier?: User;
}

export abstract class VerifiableModel<
    T extends VerifiableData = {},
    F = {}
> extends BaseModel<T, F & { verified?: boolean }> {
    async verify(id: string) {
        this.loading = true;

        await service.patch(this.baseURI + id, { verified: true });

        const item = this.list.find(({ objectId }) => objectId === id);

        (item.verified = true), (item.verifier = session.user);

        this.loading = false;
    }
}
