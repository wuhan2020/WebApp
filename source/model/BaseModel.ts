import { Filter, ListModel, toggle } from 'mobx-restful';
import { buildURLData } from 'web-utility';

import { DataItem, service, PageData, User } from '../service';
import { session } from '.';

export abstract class BaseModel<
    T extends DataItem = DataItem,
    F extends Filter<T> = Filter<T>
> extends ListModel<T, F> {
    client = service;
    indexKey = 'objectId' as const;

    async loadPage(pageIndex: number, pageSize: number, filter: F) {
        const {
            body: { count, data }
        } = await this.client.get<PageData<T>>(
            `${this.baseURI}?${buildURLData({
                ...filter,
                pageIndex,
                pageSize
            })}`
        );
        return { pageData: data, totalCount: count };
    }
}

export interface VerifiableData extends DataItem {
    verified?: boolean;
    verifier?: User;
}

export abstract class VerifiableModel<
    T extends VerifiableData = VerifiableData,
    F extends Filter<T> = Filter<T>
> extends BaseModel<T, F> {
    @toggle('uploading')
    async verify(id: string) {
        await this.client.patch(this.baseURI + id, { verified: true });

        this.changeOne(
            { verified: true, verifier: session.user } as Partial<T>,
            id,
            true
        );
    }
}
