import { DataItem, Place } from '../service';
import { Supplies } from './SuppliesRequirement';
import { BaseModel } from './BaseModel';

export interface Factory extends DataItem, Place {
    name?: string;
    qualification?: string;
    category?: string;
    capability?: string;
    supplies?: Supplies[];
}

export class FactoryModel extends BaseModel<Factory> {
    baseURI = '/vendor/';
}
