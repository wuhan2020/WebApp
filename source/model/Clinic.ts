import { VerifiableData, VerifiableModel } from './BaseModel';
import { Organization } from '../service';

export interface Clinic extends VerifiableData, Organization {
    name?: string;
    startTime?: string;
    endTime?: string;
}

export class ClinicModel extends VerifiableModel<Clinic> {
    baseURI = '/clinic/';
}
