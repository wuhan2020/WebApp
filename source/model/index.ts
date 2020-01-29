import { History } from 'cell-router/source';

import { Session } from './Session';
import { SuppliesRequirementModel } from './SuppliesRequirement';
import { FreeClinicModel } from './FreeClinic';
import { GitHubModel } from './GitHub';

export const history = new History();
export const session = new Session();
export const suppliesRequirement = new SuppliesRequirementModel();
export const freeClinic = new FreeClinicModel();

export * from './HTTPService';
export * from './GitService';
export * from './SuppliesRequirement';
export * from './AMap';
export * from './FreeClinic';
