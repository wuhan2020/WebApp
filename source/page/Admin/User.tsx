import { component, observer } from 'web-cell';
import {
    FormCheck,
    Button,
    ScrollBoundary,
    TouchHandler,
    Table,
    FormControl
} from 'boot-cell';
import { CustomElement } from 'web-utility';

import { SessionBox } from '../../component';
import { User } from '../../service';
import { user } from '../../model';

@component({ tagName: 'user-admin' })
@observer
export class UserAdmin extends HTMLElement implements CustomElement {
    filter: { phone?: string } = {};

    connectedCallback() {
        user.getRoles();
    }

    loadMore: TouchHandler = detail => {
        if (detail === 'bottom') return user.getNextPage(this.filter);
    };

    search = (event: Event) => {
        event.preventDefault();

        const { elements } = event.target as HTMLFormElement;
        const { value } = elements.item(0) as HTMLInputElement;

        return user.getNextPage(
            (this.filter = value ? { phone: value } : {}),
            true
        );
    };

    toggleRole(uid: string, rid: string, { target }: MouseEvent) {
        const { checked } = target as HTMLInputElement;

        return checked ? user.addRole(uid, rid) : user.removeRole(uid, rid);
    }

    renderItem = ({
        mobilePhoneNumber,
        createdAt,
        roles,
        objectId: uid
    }: User) => (
        <tr key={uid}>
            <td>{mobilePhoneNumber}</td>
            <td>{new Date(createdAt).toLocaleString()}</td>
            <td>
                {user.roles?.map(({ objectId, name }) => (
                    <FormCheck
                        type="switch"
                        label={<>{name}</>}
                        value={objectId}
                        checked={roles.includes(name)}
                        onClick={event => this.toggleRole(uid, objectId, event)}
                    />
                ))}
            </td>
        </tr>
    );

    render() {
        const { loading, list, noMore } = user;

        return (
            <SessionBox>
                <header className="d-flex justify-content-between">
                    <h1>用户管理</h1>
                    {/* @ts-ignore */}
                    <form className="d-flex" onSubmit={this.search}>
                        <FormControl
                            type="search"
                            className="me-3"
                            name="phone"
                        />
                        <Button
                            className="text-nowrap"
                            type="submit"
                            variant="primary"
                        >
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
                        <tbody>{list.map(this.renderItem)}</tbody>
                    </Table>

                    <p slot="bottom" className="text-center mt-2">
                        {noMore ? '没有更多数据了' : '加载更多...'}
                    </p>
                </ScrollBoundary>
            </SessionBox>
        );
    }
}
