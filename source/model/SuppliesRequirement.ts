import { District } from '../component';
import { Place } from '../service';
import { VerifiableData, VerifiableModel } from './BaseModel';

export interface Supplies {
    name: string;
    type: 'face' | 'leg' | 'disinfection' | 'device' | 'other';
    remark: string;
    count: number;
}

export interface SuppliesRequirement extends VerifiableData, Place {
    hospital?: string;
    supplies?: Supplies[];
}

export class SuppliesRequirementModel extends VerifiableModel<
    SuppliesRequirement,
    District
> {
    baseURI = '/supplies/requirement/';
}
