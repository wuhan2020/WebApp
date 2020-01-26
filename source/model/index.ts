import { History } from 'cell-router/source';

import { GitHubModel } from './GitHub';

export const history = new History();

export const repository = new GitHubModel({
    owner: 'EasyWebApp',
    repo: 'wuhan2020'
});
