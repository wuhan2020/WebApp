import { DataItem, Contact, User, Place } from '../HTTPService';
import { Supplies } from '../SuppliesRequirement';

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
