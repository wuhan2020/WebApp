import { User } from '@wuhan2020/rest-api';
import { Filter, toggle } from 'mobx-restful';

import { TableModel } from './BaseModel';

export class UserModel extends TableModel<User, Filter<User> & { phone?: string }> {
    baseURI = '/user/';

    @toggle('uploading')
    async addRole(uid: number, rid: number) {
        await this.client.post(`${this.baseURI}${uid}/role/${rid}`);
    }

    @toggle('uploading')
    async removeRole(uid: number, rid: number) {
        await this.client.delete(`${this.baseURI}${uid}/role/${rid}`);
    }
}
