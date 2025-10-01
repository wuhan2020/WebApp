import { DonationRecipient } from '@wuhan2020/rest-api';

import { VerifiableModel } from './BaseModel';

export class DonationRecipientModel extends VerifiableModel<DonationRecipient> {
    baseURI = '/donation/recipient/';
}
