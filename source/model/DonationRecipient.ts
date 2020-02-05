import { VerifiableData, VerifiableModel } from './BaseModel';
import { Organization } from '../service';

export interface BankAccount {
    name: string;
    number: string;
    bank: string;
}

export interface DonationRecipient extends VerifiableData, Organization {
    name?: string;
    accounts?: BankAccount[];
}

export class DonationRecipientModel extends VerifiableModel<DonationRecipient> {
    baseURI = '/donation/recipient/';
}
