import { SuppliesRequirement } from '@wuhan2020/rest-api';

import { District } from '../component';
import { VerifiableModel } from './BaseModel';

export class SuppliesRequirementModel extends VerifiableModel<SuppliesRequirement, District> {
    baseURI = '/supplies/requirement/';
}
