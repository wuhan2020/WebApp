import { observable } from 'mobx';
import { blobOf } from 'koajax';

import client, { User, FileData, Role } from './HTTPService';

export class Session {
    @observable
    user: User;

    constructor() {
        if (sessionStorage.user) this.user = JSON.parse(sessionStorage.user);
        else this.getProfile();
    }

    save(user?: User) {
        this.user = user;

        if (user != null) sessionStorage.user = JSON.stringify(user);
        else delete sessionStorage.user;

        return user;
    }

    async getProfile() {
        try {
            const { body } = await client.get<User>('/session');

            return this.save(body);
        } catch (error) {
            if (error.status !== 401) throw error;
        }
    }

    sendSMSCode(phone: string) {
        return client.post('/session/smsCode', { phone });
    }

    async signIn(phone: string, code: string) {
        const { body } = await client.post<User>('/session', { phone, code });

        return this.save(body);
    }

    async signOut() {
        await client.delete('/session');

        this.save(null);
    }

    hasRole(name: keyof typeof Role) {
        return this.user?.roles.includes(name);
    }

    async upload(file: Blob | string | URL, name?: string) {
        if (!(file instanceof Blob)) file = await blobOf(file + '');

        if (name) file = new File([file], name);

        const data = new FormData();

        data.append('file', file);

        const {
            body: { url }
        } = await client.post<FileData>('/file', data);

        return url;
    }
}
