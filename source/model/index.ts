import { History } from 'cell-router/source';

import { Session } from './Session';
import { SuppliesRequirementModel } from './SuppliesRequirement';
import { GitHubModel } from './GitHub';
import { FactoryService } from './services/FactoryService';

export const history = new History();
export const session = new Session();
export const suppliesRequirement = new SuppliesRequirementModel();
export const FactoryStore = new FactoryService();

export const repository = new GitHubModel({
    owner: 'EasyWebApp',
    repo: 'wuhan2020'
});

export * from './HTTPService';
export * from './SuppliesRequirement';
export * from './AMap';
export * from './services/FactoryService';
export * from './types/Factory';
