import { DataItem, Organization } from '../service';
import { BaseModel } from './BaseModel';

export interface BankAccount {
    name: string;
    number: string;
    bank: string;
}

export interface DonationRecipient extends DataItem, Organization {
    name?: string;
    accounts?: BankAccount[];
}

export class DonationRecipientModel extends BaseModel<DonationRecipient> {
    baseURI = '/donation/recipient/';
}
