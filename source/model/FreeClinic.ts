import { observable } from 'mobx';
import service, { DataItem, User, PageData } from './HTTPService';
// import { Contact } from './SuppliesRequirement';

const mockData = [
    {
        name: '京东健康',
        phones: '问诊热线 010-89128261 或 010-89128263',
        url: 'https://mp.weixin.qq.com/s/xVuqfWdQJ0INbgBYxxdJGw',
        notes: '免费问诊，每天8:00-20:00之间'
    },
    {
        name: '',
        phones: '',
        url: '',
        notes: ''
    }
];

export interface FreeClinic extends DataItem {
    // clinic?: string;
    // address?: string;
    // coords?: number[];
    // supplies?: string[];
    // contacts?: Contact[];
    // creator?: User;
    name: string;
    url: string;
    notes: string;
    phones: string[];
}

export class FreeClinicModel {
    @observable
    pageIndex = 0;

    pageSize = 10;

    totalCount = 0;

    @observable
    list = [];

    async getNextPage() {
        // if (this.pageIndex && this.list.length === this.totalCount) return;

        // const {
        //     body: { count, data }
        // } = await service.get<PageData<SuppliesRequirement>>(
        //     '/supplies/requirement?' +
        //         new URLSearchParams({
        //             pageIndex: this.pageIndex + 1 + '',
        //             pageSize: this.pageSize + ''
        //         })
        // );
        // this.pageIndex++, (this.totalCount = count);

        // this.list = this.list.concat(data);

        // return data;

        this.list = mockData;
        return mockData;
    }

    // async update(data: FreeClinic, id?: string) {
    //     if (!id) {
    //         const { body } = await service.post<FreeClinic>(
    //             '/supplies/requirement',
    //             data
    //         );

    //         this.list = [body].concat(this.list);
    //     } else {
    //         const { body } = await service.put<FreeClinic>(
    //                 '/supplies/requirement/' + id,
    //                 data
    //             ),
    //             index = this.list.findIndex(({ objectId }) => objectId === id);

    //         this.list[index] = body;
    //     }
    // }

    // async getOne(id: string) {
    //     const { body } = await service.get<FreeClinic>(
    //         '/supplies/requirement/' + id
    //     );
    //     return body;
    // }

    async delete(id: string) {
        await service.delete('/supplies/requirement/' + id);

        this.list = this.list.filter(({ objectId }) => objectId !== id);
    }
}
