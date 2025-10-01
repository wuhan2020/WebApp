import { Hotel } from '@wuhan2020/rest-api';

import { VerifiableModel } from './BaseModel';

export class HotelModel extends VerifiableModel<Hotel> {
    baseURI = '/hotel/';
}
