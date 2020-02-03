import { DataItem, Organization } from '../service';
import { BaseModel } from './BaseModel';

export interface Clinic extends DataItem, Organization {
    name?: string;
    startTime?: string;
    endTime?: string;
}

export class ClinicModel extends BaseModel<Clinic> {
    baseURI = '/clinic/';
}
