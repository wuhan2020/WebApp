import { service, DataItem, Contact, Place } from './HTTPService';
import { observable } from 'mobx';
export interface BankAccount {
    name: string;
    number: string;
    bank: string;
}
export interface DonationItem extends DataItem, Place {
    name?: string; //机构名
    url?: string; //官方网址
    accounts?: BankAccount[]; //银行相关信息
    bankNo?: string;
    bankAddress?: string;
    bankName?: string;
    contacts?: Contact[]; //联系人（姓名、电话）
    remark?: string; //备注
}
export class DonationService {
    @observable
    pageIndex = 0;
    pageSize = 10;
    totalCount = 0;
    list = [];
    constructor() {}
    async getResultPage() {
        if (this.pageIndex && this.list.length === this.totalCount) return;
        const {
            body: { count, data }
        } = await service.get(
            '/donation/recipient?' +
                new URLSearchParams({
                    pageIndex: this.pageIndex + 1 + '',
                    pageSize: this.pageSize + ''
                })
        );
        this.pageIndex++, (this.totalCount = count);
        this.list = this.list.concat(data);
        if (this.pageIndex == 1 && this.totalCount <= this.pageSize)
            return null;
        return data;
    }

    async update(data: any, id?: string) {
        return id
            ? service.put('/donation/recipient/' + id, data)
            : service.post('/donation/recipient', data);
    }

    async getOne(id?: string) {
        const {
            body: { data }
        } = await service.get('/donation/recipient/' + id);
        return data;
    }

    async delete(id: string) {
        return await service.delete('/donation/recipient/' + id);
    }
}
