import { observable } from 'mobx';
import service, { DataItem, User, PageData } from './HTTPService';
import { Contact } from './SuppliesRequirement';

const mockData = [
    {
        name: '柏曼酒店黄冈武穴店',
        hotelAddress: {
            area: '武穴市',
            address: '玉湖路'
        },
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
        hotelAddress: {
            area: '武穴市',
            address: '刊江大道188号'
        },
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
        hotelAddress: {
            area: '黄州区',
            address: '赤壁大道99号'
        },
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
        hotelAddress: {
            area: '罗田县',
            address: '凤山镇城南新区凤城大道2号'
        },
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
        hotelAddress: {
            area: '红安县',
            address: '将军国际广场旁边'
        },
        capacity: 100,
        contacts: [
            {
                name: '易德照',
                number: '17371462811'
            }
        ]
    }
];

interface IHotelAddress {
    area: string;
    address: string;
}
export interface HotelCanStaying extends DataItem {
    hotel?: string;
    hotelAddress?: IHotelAddress;
    capacity?: number;
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
}
