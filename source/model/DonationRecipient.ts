import { DataItem, Contact, Place } from '../service';
import { BaseModel } from './BaseModel';

export interface BankAccount {
    name: string;
    number: string;
    bank: string;
}

export interface DonationRecipient extends DataItem, Place {
    name?: string;
}

export class DonationRecipientModel extends BaseModel<DonationRecipient> {
    baseURI = '/donation/recipient/';
}
