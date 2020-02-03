import { DataItem, Place } from '../service';
import { BaseModel } from './BaseModel';

export interface Hotel extends DataItem, Place {
    name?: string;
    capacity?: number;
}

export class HotelModel extends BaseModel<Hotel> {
    baseURI = '/hotel/';
}
