import { Vendor } from '@wuhan2020/rest-api';

import { VerifiableModel } from './BaseModel';

export class FactoryModel extends VerifiableModel<Vendor> {
    baseURI = '/vendor/';
}
