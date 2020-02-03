import 'core-js/es/string/match-all';
import { GitHubClient } from './GitHub';

export const repository = new GitHubClient({
    owner: 'EasyWebApp',
    repo: 'wuhan2020'
});

export * from './HTTP';
export * from './GitHub';
export * from './AMap';
