import { observable } from 'mobx';
import { service, DataItem, Contact, Place } from '../service';
import { BaseModel } from './BaseModel';

export interface BankAccount {
    name: string;
    number: string;
    bank: string;
}

export interface DonationRecipient extends DataItem, Place {
    name?: string; //机构名
    url?: string; //官方网址
    accounts?: BankAccount[]; //银行相关信息
    bankNo?: string;
    bankAddress?: string;
    bankName?: string;
    contacts?: Contact[]; //联系人（姓名、电话）
    remark?: string; //备注
}

export class DonationRecipientModel extends BaseModel<DonationRecipient> {
    baseURI = '/donation/recipient';
}
