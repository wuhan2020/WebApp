import { BaseModel } from './BaseModel';
import { DataItem, RoleNames, User, service } from '../service';
import { observable } from 'mobx';

export interface Role extends DataItem {
    name: RoleNames;
}

export class UserModel extends BaseModel<User, { phone?: string }> {
    baseURI = '/user/';

    @observable
    roles: Role[];

    async getRoles() {
        const { body } = await service.get<Role[]>('/role');

        return (this.roles = body);
    }

    async addRole(uid: string, rid: string) {
        await service.post(`${this.baseURI}${uid}/role/${rid}`);

        const user = this.list.find(({ objectId }) => objectId === uid),
            { name } = this.roles.find(({ objectId }) => objectId === rid);

        user.roles = user.roles.concat(name);
    }

    async removeRole(uid: string, rid: string) {
        await service.delete(`${this.baseURI}${uid}/role/${rid}`);

        const user = this.list.find(({ objectId }) => objectId === uid),
            { name } = this.roles.find(({ objectId }) => objectId === rid);

        user.roles = user.roles.filter(role => role !== name);
    }
}
