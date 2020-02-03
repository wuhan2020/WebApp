import { DataItem, Contact } from '../service';
import { BaseModel } from './BaseModel';

export interface Clinic extends DataItem {
    name?: string;
    url?: string;
    contacts?: Contact;
    time?: string;
}

export class ClinicModel extends BaseModel<Clinic> {
    baseURI = '/clinic';
}
