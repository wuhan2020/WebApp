import { observable } from 'mobx';
import service, { DataItem, User, PageData } from './HTTPService';
import { Contact } from './SuppliesRequirement';

const mockData = [
    {
        name: '柏曼酒店黄冈武穴店',
        address: '武穴市 玉湖路',
        capacity: 100,
        contacts: [
            {
                name: '王丽君',
                number: '15926715506'
            }
        ]
    },
    {
        name: '城市便捷武穴客运站店',
        address: '武穴市 刊江大道188号',
        capacity: 100,
        contacts: [
            {
                name: '许良师',
                number: '0713-6273377'
            }
        ]
    },
    {
        name: '城市便捷武穴万达广场店',
        address: '黄州区 赤壁大道99号',
        capacity: 100,
        contacts: [
            {
                name: '徐偲',
                number: '18694054334'
            }
        ]
    },
    {
        name: '城市便捷罗田桥南店',
        address: '罗田县 凤山镇城南新区凤城大道2号',
        capacity: 100,
        contacts: [
            {
                name: '刘力',
                number: '18207170535'
            }
        ]
    },
    {
        name: '城市便捷红安将军广场店',
        address: '红安县 将军国际广场旁边',
        capacity: 100,
        contacts: [
            {
                name: '易德照',
                number: '17371462811'
            }
        ]
    }
];

export interface HotelCanStaying extends DataItem {
    hotel?: string;
    address?: string;
    capacity?: string;
    coords?: number[];
    contacts?: Contact[];
    creator?: User;
}

export class HotelCanStayingModel {
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
        // } = await service.get<PageData<HotelCanStaying[]>>(
        //     '/supplies/requirement?' +
        //         new URLSearchParams({
        //             pageIndex: this.pageIndex + 1 + '',
        //             pageSize: this.pageSize + ''
        //         })
        // );
        // this.pageIndex++, (this.totalCount = count);

        this.list = mockData;
        return mockData;
    }

    update(data: HotelCanStaying, id?: string) {
        return id
            ? service.put('/supplies/requirement/' + id, data)
            : service.post('/supplies/requirement', data);
    }

    async getOne(id: string) {
        const { body } = await service.get<HotelCanStaying>(
            '/supplies/requirement/' + id
        );
        return body;
    }
}
