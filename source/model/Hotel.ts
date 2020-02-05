import { VerifiableData, VerifiableModel } from './BaseModel';
import { Place } from '../service';

export interface Hotel extends VerifiableData, Place {
    name?: string;
    capacity?: number;
}

export class HotelModel extends VerifiableModel<Hotel> {
    baseURI = '/hotel/';
}
