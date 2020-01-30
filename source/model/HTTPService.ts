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

export interface Contact {
    name: string;
    number: string;
}

export interface GeoCoord {
    latitude: number;
    longitude: number;
}

export interface Place {
    province?: string;
    city?: string;
    district?: string;
    address?: string;
    coords?: GeoCoord;
}
