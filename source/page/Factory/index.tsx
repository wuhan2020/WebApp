import * as clipboard from 'clipboard-polyfill';
import { component, mixin, createCell, Fragment } from 'web-cell';
import { observer } from 'mobx-web-cell';

import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Button } from 'boot-cell/source/Form/Button';
import { Card } from 'boot-cell/source/Content/Card';
import { DropMenu } from 'boot-cell/source/Navigator/DropMenu';
import { EdgeEvent } from 'boot-cell/source/Content/EdgeDetector';

import { AuditBar } from '../../component/AuditBar';
import { factory, Factory } from '../../model';

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
    state = { loading: false, noMore: false };

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
        url,
        name,
        qualification,
        supplies = [],
        province,
        city,
        district,
        address,
        contacts,
        remark,
        ...rest
    }: Factory) => (
        <Card
            className="mx-auto mb-4 mx-sm-1"
            style={{ minWidth: '20rem', maxWidth: '20rem' }}
            title={
                url ? (
                    <a target="_blank" href={url}>
                        {name}
                    </a>
                ) : (
                    name
                )
            }
        >
            <p>
                资质证明：<code>{qualification}</code>
            </p>
            <p>地址：{province + city + district + address}</p>

            <h6>物资产能</h6>
            <ol>
                {supplies.map(({ name, count, remark }) => (
                    <li title={remark}>
                        {name}{' '}
                        <span className="badge badge-danger">{count}个</span>
                    </li>
                ))}
            </ol>

            {remark && <p className="text-muted">{remark}</p>}

            <div className="text-center">
                <Button
                    onClick={() =>
                        this.clip2board(province + city + district + address)
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
            <AuditBar scope="factory" model={factory} {...rest} />
        </Card>
    );

    render(_, { loading, noMore }: FactoryPageState) {
        return (
            <Fragment>
                <header className="d-flex justify-content-between align-item-center my-3">
                    <h2>生产厂商</h2>
                    <span>
                        <Button kind="warning" href="factory/edit">
                            生产发布
                        </Button>
                    </span>
                </header>

                <edge-detector onTouchEdge={this.loadMore}>
                    <SpinnerBox
                        cover={loading}
                        className="card-deck justify-content-around"
                    >
                        {factory.list.map(this.renderItem)}
                    </SpinnerBox>
                    <p slot="bottom" className="text-center mt-2">
                        {noMore ? '没有更多数据了' : '加载更多...'}
                    </p>
                </edge-detector>
            </Fragment>
        );
    }
}
