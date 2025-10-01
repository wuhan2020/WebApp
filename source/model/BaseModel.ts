import { Base, ListChunk, VerificationBase } from '@wuhan2020/rest-api';
import { Filter, ListModel, toggle } from 'mobx-restful';
import { buildURLData } from 'web-utility';

import { service } from '../service';

export abstract class TableModel<
    T extends Base = Base,
    F extends Filter<T> = Filter<T>
> extends ListModel<T, F> {
    client = service;

    async loadPage(pageIndex: number, pageSize: number, filter: F) {
        const {
            body: { count, list }
        } = await this.client.get<ListChunk<T>>(
            `${this.baseURI}?${buildURLData({ ...filter, pageIndex, pageSize })}`
        );
        return { pageData: list, totalCount: count };
    }
}

export abstract class VerifiableModel<
    T extends VerificationBase = VerificationBase,
    F extends Filter<T> = Filter<T>
> extends TableModel<T, F> {
    @toggle('uploading')
    async verify(id: number) {
        const { body } = await this.client.patch<T>(this.baseURI + id);

        this.changeOne(body, id, true);
    }
}
