import service from '../HTTPService';
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
    constructor() {}
    async getResultPage() {
        // TODO: Add API get
        return mock.data;
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
