import { observable } from 'mobx';
import { BaseModel, persist, restore, toggle } from 'mobx-restful';
import { blobOf } from 'web-utility';

import { FileData, RoleNames, User, service } from '../service';

export class Session extends BaseModel {
    @persist()
    @observable
    accessor user: User | undefined;

    constructor() {
        super();
        restore(this, 'session').then(() => this.user || this.getProfile());
    }

    @toggle('downloading')
    async getProfile() {
        try {
            const { body } = await service.get<User>('/session');

            return (this.user = body);
        } catch (error) {
            if (error.status !== 401) throw error;
        }
    }

    @toggle('uploading')
    sendSMSCode(phone: string) {
        return service.post('/session/smsCode', { phone });
    }

    @toggle('uploading')
    async signIn(phone: string, code: string) {
        const { body } = await service.post<User>('/session', { phone, code });

        return (this.user = body);
    }

    @toggle('uploading')
    async signOut() {
        await service.delete('/session');

        this.user = undefined;

        location.href = '.';
    }

    hasRole(name: RoleNames) {
        return this.user?.roles.includes(name);
    }

    @toggle('uploading')
    async upload(file: Blob | string | URL, name?: string) {
        if (!(file instanceof Blob)) file = await blobOf(file + '');

        if (name) file = new File([file], name);

        const data = new FormData();

        data.append('file', file);

        const { body } = await service.post<FileData>('/file', data);

        return body.url;
    }
}
