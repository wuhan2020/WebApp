import { observable } from 'mobx';
import { Filter, toggle } from 'mobx-restful';

import { DataItem, RoleNames, User } from '../service';
import { BaseModel } from './BaseModel';

export interface Role extends DataItem {
    name: RoleNames;
}

export class UserModel extends BaseModel<
    User,
    Filter<User> & { phone?: string }
> {
    baseURI = '/user/';

    @observable
    accessor roles: Role[] = [];

    @toggle('downloading')
    async getRoles() {
        const { body } = await this.client.get<Role[]>('/role');

        return (this.roles = body);
    }

    @toggle('uploading')
    async addRole(uid: string, rid: string) {
        await this.client.post(`${this.baseURI}${uid}/role/${rid}`);

        const user = this.allItems.find(({ objectId }) => objectId === uid),
            { name } = this.roles.find(({ objectId }) => objectId === rid);

        user.roles = user.roles.concat(name);
    }

    @toggle('uploading')
    async removeRole(uid: string, rid: string) {
        await this.client.delete(`${this.baseURI}${uid}/role/${rid}`);

        const user = this.allItems.find(({ objectId }) => objectId === uid),
            { name } = this.roles.find(({ objectId }) => objectId === rid);

        user.roles = user.roles.filter(role => role !== name);
    }
}
