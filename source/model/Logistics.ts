import { VerifiableData, VerifiableModel } from './BaseModel';
import { Organization } from '../service';

export interface ServiceArea {
    city: string;
    direction: 'in' | 'out' | 'both';
    personal: boolean;
}

export interface Logistics extends VerifiableData, Organization {
    name?: string;
    serviceArea?: ServiceArea[];
}

export class LogisticsModel extends VerifiableModel<Logistics> {
    baseURI = '/logistics/';
}
