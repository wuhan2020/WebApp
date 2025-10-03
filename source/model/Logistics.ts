import { Logistics } from '@wuhan2020/rest-api';

import { VerifiableModel } from './BaseModel';

export class LogisticsModel extends VerifiableModel<Logistics> {
    baseURI = '/logistics/';
}
