import { HTTPClient } from 'koajax';

export const baseUri = {
    local: 'http://localhost:3000',
    remote: 'https://vuqjf9paihid.leanapp.cn',
    test: 'https://vsw505fxbitp.leanapp.cn/'
};

export const service = new HTTPClient({
    baseURI:
        location.hostname === 'localhost'
            ? baseUri[process.env.HTTP_ENV]
            : baseUri.remote,
    withCredentials: true,
    responseType: 'json'
});

export type DataItem = Partial<
    Record<'objectId' | 'createdAt' | 'updatedAt', string>
>;

export interface PageData<T> {
    data: T[];
    count: number;
}

export enum Role {
    Admin
}

export type RoleNames = keyof typeof Role;

export interface User extends DataItem {
    username: string;
    mobilePhoneNumber: string;
    roles: RoleNames[];
}

export interface FileData extends DataItem {
    url: string;
}

export type Contact = Record<'name' | 'phone', string>;

export interface Organization {
    url?: string;
    contacts?: Contact[];
    remark?: string;
    creator?: User;
    verified?: boolean;
    verifier?: User;
}

export type GeoCoord = Record<'latitude' | 'longitude', number>;

export interface Place
    extends Organization,
        Partial<Record<'province' | 'city' | 'district' | 'address', string>> {
    coords?: GeoCoord;
}
