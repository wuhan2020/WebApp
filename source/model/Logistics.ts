import { DataItem, Contact } from '../service';
import { BaseModel } from './BaseModel';

export interface ServiceArea {
    city: string;
    direction: 'in' | 'out' | 'both';
    personal: boolean;
}

export interface Logistics extends DataItem {
    name?: string;
    url?: string;
    contacts?: Contact[];
    serviceArea?: ServiceArea[];
    remark?: string;
}

export class LogisticsModel extends BaseModel<Logistics> {
    baseURI = '/logistics';
}
