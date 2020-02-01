import { component, mixin, createCell, Fragment } from 'web-cell';
import * as clipboard from 'clipboard-polyfill';

import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Button } from 'boot-cell/source/Form/Button';
import { factory, session, Factory } from '../../model';
import { relativeTimeTo, TimeUnitName } from '../../utility';
import { Card } from 'boot-cell/source/Content/Card';
import { DropMenu } from 'boot-cell/source/Navigator/DropMenu';
import { EdgeEvent } from 'boot-cell/source/Content/EdgeDetector';
import { observer } from 'mobx-web-cell';

interface FactoryPageState {
    loading?: boolean;
    noMore?: boolean;
}

@observer
@component({
    tagName: 'factory-page',
    renderTarget: 'children'
})
export class FactoryPage extends mixin<{}, FactoryPageState>() {
    state = { loading: true, noMore: false };

    loadMore = async ({ detail }: EdgeEvent) => {
        if (detail !== 'bottom' || this.state.noMore) return;

        await this.setState({ loading: true });

        const data = await factory.getNextPage();

        await this.setState({ loading: false, noMore: !data });
    };

    async clip2board(raw: string) {
        await clipboard.writeText(raw);

        self.alert('已复制到剪贴板');
    }

    renderItem = ({
        createdAt,
        name,
        qualification,
        supplies = [],
        province,
        city,
        district,
        address,
        contacts,
        remark,
        creator: { mobilePhoneNumber, objectId: uid },
        objectId
    }: Factory) => {
        const { distance, unit } = relativeTimeTo(createdAt),
            authorized =
                session.user?.objectId === uid ||
                session.hasRole('Admin') ||
                null;

        return (
            <Card
                className="mx-auto mb-4 mx-sm-1"
                style={{ minWidth: '20rem', maxWidth: '20rem' }}
                title={name}
            >
                <ul class="list-unstyled">
                    <li>
                        <b>资质证明</b>: {qualification}
                        <br />
                    </li>
                    <li>
                        <b>地址</b>: {province + city + district + address}
                        <br />
                    </li>
                    <li>
                        <b>备注</b>:{remark}
                        <br />
                    </li>
                    <li>
                        <b>物资</b>:
                        <ol>
                            {supplies.map(({ name, count, remark }) => (
                                <li title={remark}>
                                    {name}{' '}
                                    <span className="badge">{count}个</span>
                                </li>
                            ))}
                        </ol>
                    </li>
                </ul>

                <div className="text-center">
                    <Button
                        onClick={() =>
                            this.clip2board(
                                province + city + district + address
                            )
                        }
                    >
                        复制地址
                    </Button>
                    {contacts && (
                        <DropMenu
                            className="d-inline-block ml-3"
                            alignType="right"
                            title="联系方式"
                            list={contacts.map(({ name, phone }) => ({
                                title: `${name}：${phone}`,
                                href: 'tel:' + phone
                            }))}
                        />
                    )}
                </div>

                <footer className="mt-3 text-center text-mute">
                    <a href={'tel:' + mobilePhoneNumber}>{mobilePhoneNumber}</a>{' '}
                    发布于 {Math.abs(distance)} {TimeUnitName[unit]}前<br />
                    <a href="{url}" target="_blank">
                        消息来源
                    </a>
                    {authorized && (
                        <Fragment>
                            <Button
                                kind="warning"
                                block
                                className="mt-3"
                                href={'hospital/edit?srid=' + objectId}
                            >
                                编辑
                            </Button>
                            <Button
                                kind="danger"
                                block
                                className="mt-3"
                                onClick={() => factory.delete(objectId)}
                            >
                                删除
                            </Button>
                        </Fragment>
                    )}
                </footer>
            </Card>
        );
    };
    render(_, { loading, noMore }: FactoryPageState) {
        return (
            <SpinnerBox cover={loading}>
                <header className="d-flex justify-content-between align-item-center my-3">
                    <h2>生产厂商</h2>
                    <span>
                        <Button kind="warning" href="factory/edit">
                            生产发布
                        </Button>
                    </span>
                </header>

                <edge-detector onTouchEdge={this.loadMore}>
                    <div className="card-deck justify-content-around">
                        {factory.list.map(this.renderItem)}
                    </div>
                    <p slot="bottom" className="text-center mt-2">
                        {noMore ? '没有更多数据了' : '加载更多...'}
                    </p>
                </edge-detector>
            </SpinnerBox>
        );
    }
}
