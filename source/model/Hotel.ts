import { DataItem, Place, Contact, User } from '../service';
import { BaseModel } from './BaseModel';

export interface Hotel extends DataItem, Place {
    name?: string;
    address?: string;
    capacity?: number;
    contacts?: Contact[];
    creator?: User;
    url?: string;
}

export class HotelModel extends BaseModel<Hotel> {
    baseURI = '/hotel/';
}
