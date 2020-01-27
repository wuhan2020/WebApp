import { History } from 'cell-router/source';

import { Session } from './Session';
import { GitHubModel } from './GitHub';

export const history = new History();
export const session = new Session();

export const repository = new GitHubModel({
    owner: 'EasyWebApp',
    repo: 'wuhan2020'
});

export * from './Service';
