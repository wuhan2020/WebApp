import { GitHubClient } from './GitHub';

export const repository = new GitHubClient({
    owner: 'wuhan2020',
    repo: 'WebApp'
});

export * from './HTTP';
export * from './GitHub';
export * from './AMap';
export * from './Epidemic';
