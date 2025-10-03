import { Clinic } from '@wuhan2020/rest-api';

import { VerifiableModel } from './BaseModel';

export class ClinicModel extends VerifiableModel<Clinic> {
    baseURI = '/clinic/';
}
