import { DataItem, Organization } from '../service';
import { BaseModel } from './BaseModel';

export interface ServiceArea {
    city: string;
    direction: 'in' | 'out' | 'both';
    personal: boolean;
}

export interface Logistics extends DataItem, Organization {
    name?: string;
    serviceArea?: ServiceArea[];
}

export class LogisticsModel extends BaseModel<Logistics> {
    baseURI = '/logistics/';
}
