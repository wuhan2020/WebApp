import { RepositoryModel } from 'mobx-github';

export const repository = new RepositoryModel('wuhan2020');

export * from './HTTP';
export * from './AMap';
export * from './Epidemic';
