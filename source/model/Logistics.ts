import { Contact } from './SuppliesRequirement';

const mockData = [
    {
        name: '顺丰集团',
        area: '武汉寄入寄出',
        contacts: [
            {
                name: '',
                number: '95338'
            }
        ],
        url: 'https://mp.weixin.qq.com/s/42UEPYlYR1EDCM8JKZQyqw',
        note: '无',
        status: '已审核'
    }
];

export interface LogisticsItem {
    name: string;
    area: string;
    contacts: Contact[];
    url: string;
    note: string;
    status: string;
}

export class LogisticsModel {
    async getResultPage() {
        return { result: mockData };
    }
}
