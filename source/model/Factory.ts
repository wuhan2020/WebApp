import { DataItem, Place, Contact, User } from '../service';
import { Supplies } from './SuppliesRequirement';
import { BaseModel } from './BaseModel';

export interface Factory extends DataItem, Place {
    name?: string;
    qualification?: string;
    category?: string;
    capability?: string;
    supplies?: Supplies[];
    contacts?: Contact[];
    creator?: User;
    url?: string;
    remark?: string;
}

export class FactoryModel extends BaseModel<Factory> {
    baseURI = '/vendor';
}
