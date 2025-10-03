import { UserRole } from '@wuhan2020/rest-api';
import { HTTPClient } from 'koajax';

export const baseUri = {
    local: 'http://localhost:3000',
    remote: 'https://wuhan2020-data.kaiyuanshe.cn/',
    test: 'https://wuhan2020-data-test.kaiyuanshe.cn/'
};

export const service = new HTTPClient({
    baseURI: location.hostname === 'localhost' ? baseUri[process.env.HTTP_ENV] : baseUri.remote,
    withCredentials: true,
    responseType: 'json'
});

export const UserRoles = { Admin: 0, Worker: 1, Client: 2 } as const;

export type RoleNames = keyof typeof UserRole;

export type Address = Record<'province' | 'city' | 'district' | 'address', string>;
