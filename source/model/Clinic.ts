import { DataItem, Contact, User } from '../service';
import { BaseModel } from './BaseModel';

export interface Clinic extends DataItem {
    name?: string;
    url?: string;
    contacts?: Contact[];
    startTime?: string;
    endTime?: string;
    remark?: string;
    creator?: User;
}

export class ClinicModel extends BaseModel<Clinic> {
    baseURI = '/clinic/';
}
