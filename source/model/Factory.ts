import { VerifiableData, VerifiableModel } from './BaseModel';
import { Place } from '../service';
import { Supplies } from './SuppliesRequirement';

export interface Factory extends VerifiableData, Place {
    name?: string;
    qualification?: string;
    category?: string;
    capability?: string;
    supplies?: Supplies[];
}

export class FactoryModel extends VerifiableModel<Factory> {
    baseURI = '/vendor/';
}
