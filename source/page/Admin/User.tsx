import { User } from '@wuhan2020/rest-api';
import { Button, FormCheck, FormControl, ScrollBoundary, Table, TouchHandler } from 'boot-cell';
import { component, observer } from 'web-cell';
import { CustomElement } from 'web-utility';

import { SessionBox } from '../../component';
import { user } from '../../model';
import { UserRoles } from '../../service';

@component({ tagName: 'user-admin' })
@observer
export default class UserAdmin extends HTMLElement implements CustomElement {
    filter: { phone?: string } = {};

    loadMore: TouchHandler = detail => {
        if (detail === 'bottom') return user.getList(this.filter);
    };

    search = (event: Event) => {
        event.preventDefault();

        const { elements } = event.target as HTMLFormElement;
        const { value } = elements.item(0) as HTMLInputElement;

        return user.getList((this.filter = value ? { phone: value } : {}), 1);
    };

    toggleRole(uid: number, rid: number, { target }: MouseEvent) {
        const { checked } = target as HTMLInputElement;

        return checked ? user.addRole(uid, rid) : user.removeRole(uid, rid);
    }

    renderItem = ({ mobilePhone, createdAt, roles, id: uid }: User) => (
        <tr key={uid}>
            <td>{mobilePhone}</td>
            <td>{new Date(createdAt).toLocaleString()}</td>
            <td>
                {Object.entries(UserRoles).map(([name, id]) => (
                    <FormCheck
                        type="switch"
                        label={name}
                        value={id + ''}
                        checked={roles.includes(id)}
                        onClick={event => this.toggleRole(uid, id, event)}
                    />
                ))}
            </td>
        </tr>
    );

    render() {
        const { allItems, noMore } = user;

        return (
            <SessionBox>
                <header className="d-flex justify-content-between">
                    <h1>用户管理</h1>

                    <form className="d-flex" onSubmit={this.search}>
                        <FormControl type="search" className="me-3" name="phone" />
                        <Button className="text-nowrap" type="submit" variant="primary">
                            搜索
                        </Button>
                    </form>
                </header>

                <ScrollBoundary onTouch={this.loadMore}>
                    <Table className="text-center" striped hover>
                        <thead>
                            <tr>
                                <th>手机号</th>
                                <th>注册时间</th>
                                <th>角色</th>
                            </tr>
                        </thead>
                        <tbody>{allItems.map(this.renderItem)}</tbody>
                    </Table>

                    <p slot="bottom" className="text-center mt-2">
                        {noMore ? '没有更多数据了' : '加载更多...'}
                    </p>
                </ScrollBoundary>
            </SessionBox>
        );
    }
}
