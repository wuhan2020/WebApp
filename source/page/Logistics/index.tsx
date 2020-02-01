import { component, mixin, createCell, templateOf } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Card } from 'boot-cell/source/Content/Card';
import { Button } from 'boot-cell/source/Form/Button';
import { EdgeEvent } from 'boot-cell/source/Content/EdgeDetector';

import {
    logistics,
    Contact,
    LogisticsItem,
    ServiceArea
} from '../../model';

interface LogisticsPageState {
    loading?: boolean;
    noMore?: boolean;
    list?: LogisticsItem[];
}

const DIREACTION = {
    in: '寄入',
    out: '寄出',
    both: '寄入寄出'
};

@observer
@component({
    tagName: 'logistics-page',
    renderTarget: 'children'
})
export class LogisticsPage extends mixin<{}, LogisticsPageState>() {
    state = { loading: true, noMore: false, list: [] };

    loadMore = async ({ detail }: EdgeEvent) => {
        if (detail !== 'bottom' || this.state.noMore) return;
        await this.setState({ loading: true });
        const data = await logistics.getNextPage(); // 新增的 data
        const { list } = this.state;
        const newList = data ? list.concat(data) : list;
        await this.setState({ loading: false, noMore: !data, list: newList });
    };

    renderItem = ({
        url,
        name,
        serviceArea,
        contacts,
        remark
    }: LogisticsItem) => {
        return (
            <Card
                className="mx-auto mb-4 mx-sm-1"
                style={{ minWidth: '20rem', maxWidth: '20rem' }}
                title={name}
            >
                <p style={{ marginBottom: '0.25rem' }}>
                    <a href={url} target="_blank">
                        消息来源 &gt;&gt;
                    </a>
                </p>
                {this.renderServiceArea(serviceArea)}
                {this.renderContacts(contacts)}
                <p>{remark}</p>
            </Card>
        );
    };

    renderServiceArea = (serviceAreas: ServiceArea[]) => {
        // NOTE
        // 目前看应该服务地区应该都只有一条消息 所以暂时只展示第一条
        // 后续如果有多条地域信息 再修改这里
        const info = serviceAreas[0];
        const { city, direction, personal } = info;
        const donationNote = `${personal ? '接受' : '不接受'}个人捐赠`;
        return (
            <div>
                <p style={{ marginBottom: '0.25rem' }}>
                    <strong>地区：</strong>
                    {city}
                </p>
                <p style={{ marginBottom: '0.25rem' }}>
                    <strong>方向：</strong>
                    {DIREACTION[direction]}
                </p>
                <p style={{ marginBottom: '0.25rem' }}>{donationNote}</p>
            </div>
        );
    };

    renderContacts = (contacts: Contact[]) => {
        return contacts.map(item => {
            return (
                <p style={{ marginBottom: '0.25rem' }}>
                    <a
                        className="text-center text-decoration-none"
                        href={'tel:' + item.phone}
                    >
                        <i
                            className="fa fa-phone btn btn-sm btn-primary"
                            aria-hidden="true"
                        />
                        &nbsp;
                        {item.name}
                        &nbsp;
                        {item.phone}
                    </a>
                </p>
            );
        });
    };

    render(_, { loading, list, noMore }: LogisticsPageState) {
        return (
            <SpinnerBox cover={loading}>
                <header className="d-flex justify-content-between align-item-center my-3">
                    <h2>物流公司</h2>
                    <span>
                        <Button kind="success" href="logistics/edit">
                            物流发布
                        </Button>
                    </span>
                </header>

                <edge-detector onTouchEdge={this.loadMore}>
                    <div class="card-deck justify-content-around">
                        {list.map(this.renderItem)}
                    </div>
                    <p slot="bottom" className="text-center mt-2">
                        {noMore ? '没有更多数据了' : '加载更多...'}
                    </p>
                </edge-detector>
            </SpinnerBox>
        );
    }
}
