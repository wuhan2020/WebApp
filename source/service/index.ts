import { GitHubClient } from './GitHub';

export const repository = new GitHubClient('wuhan2020', 'WebApp');

export * from './HTTP';
export * from './GitHub';
export * from './AMap';
export * from './Epidemic';
