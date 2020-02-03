import { DataItem, Place, Contact, User } from '../service';
import { BaseModel } from './BaseModel';
import { District } from '../component';

export interface Supplies {
    name: string;
    type: 'face' | 'leg' | 'disinfection' | 'device' | 'other';
    remark: string;
    count: number;
}

export interface SuppliesRequirement extends DataItem, Place {
    hospital?: string;
    url?: string;
    supplies?: Supplies[];
    contacts?: Contact[];
    remark?: string;
    creator?: User;
}

export class SuppliesRequirementModel extends BaseModel<SuppliesRequirement> {
    baseURI = '/supplies/requirement';

    getNextPage(filter?: District) {
        return super.getNextPage<District>(filter);
    }
}
