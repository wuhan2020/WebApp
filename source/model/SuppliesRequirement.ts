import { observable } from 'mobx';

import service, { DataItem, PageData } from './HTTPService';

export interface Contact {
    name: string;
    number: string;
}

export interface SuppliesRequirement extends DataItem {
    hospital?: string;
    address?: string;
    coords?: number[];
    supplies?: string[];
    contacts?: Contact[];
}

export class SuppliesRequirementModel {
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
        } = await service.get<PageData<SuppliesRequirement[]>>(
            '/supplies/requirement?' +
                new URLSearchParams({
                    pageIndex: this.pageIndex + 1 + '',
                    pageSize: this.pageSize + ''
                })
        );
        this.pageIndex++, (this.totalCount = count);

        this.list = this.list.concat(data);

        return data;
    }

    create(data: SuppliesRequirement) {
        return service.post('/supplies/requirement', data);
    }

    async getOne(id: string) {
        const { body } = await service.get<SuppliesRequirement>(
            '/supplies/requirement/' + id
        );
        return body;
    }
}
