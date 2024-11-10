import { Place } from '../service';
import { VerifiableData, VerifiableModel } from './BaseModel';

export interface Hotel extends VerifiableData, Place {
    name?: string;
    capacity?: number;
}

export class HotelModel extends VerifiableModel<Hotel> {
    baseURI = '/hotel/';
}
