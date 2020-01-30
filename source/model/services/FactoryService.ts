import { observable } from 'mobx';
import { service, PageData } from '../HTTPService';
import { Factory } from '../types/Factory';
let mock = {
    data: [
        {
            name: 'test name',
            certificate:
                'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2330000107,3882251350&fm=15&gp=0.jpg',
            address: 'test address',
            category: 'test category',
            capability: 'test capability',
            contacts: [
                {
                    name: 'test contact name',
                    number: '1234567'
                }
            ]
        }
    ]
};

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
            '/supplies/requirement?' +
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

    async update(data: any, id?: string) {
        // TODO: Add API post
        const { body } = await service.post(' ', data);
        return body;
    }

    async getOne(id: string) {
        // TODO: Add API post
        const { body } = await service.get(' ' + id);
        return body;
    }

    async delete(id: string) {
        // TODO: Add API delete
        await service.delete('', id);
    }
}
