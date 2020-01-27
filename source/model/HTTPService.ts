import { HTTPClient } from 'koajax';

export default new HTTPClient({
    baseURI:
        location.hostname === 'localhost'
            ? 'http://localhost:3000'
            : 'https://vuqjf9paihid.leanapp.cn',
    withCredentials: true,
    responseType: 'json'
});

export interface DataItem {
    objectId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface PageData<T> {
    data: T[];
    count: number;
}

export enum Role {
    Admin
}

export interface User extends DataItem {
    username: string;
    mobilePhoneNumber: string;
    roles: (keyof typeof Role)[];
}

export interface FileData extends DataItem {
    url: string;
}
