import { History } from 'cell-router/source';

import { Session } from './Session';
import { SuppliesRequirementModel } from './SuppliesRequirement';
import { FactoryService } from './services/FactoryService';

export const history = new History();
export const session = new Session();
export const suppliesRequirement = new SuppliesRequirementModel();
export const FactoryStore = new FactoryService();

export * from './HTTPService';
export * from './GitService';
export * from './SuppliesRequirement';
export * from './AMap';
export * from './services/FactoryService';
export * from './types/Factory';
