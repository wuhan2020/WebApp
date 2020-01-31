import { observable } from 'mobx';
import { service, PageData } from '../HTTPService';
import { Factory } from '../types/Factory';
let mock = {
    data: [
        {
            name: 'test name',
            qualification:
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
