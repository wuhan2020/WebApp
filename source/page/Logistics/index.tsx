import { component, mixin, createCell, templateOf } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Card } from 'boot-cell/source/Content/Card';
import { Button } from 'boot-cell/source/Form/Button';
import { EdgeEvent } from 'boot-cell/source/Content/EdgeDetector';

import { logistics, LogisticsItem, ServiceArea } from '../../model';
import { Contact } from '../../service';

interface LogisticsPageState {
    loading?: boolean;
    noMore?: boolean;
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
    state = { loading: true, noMore: false };

    loadMore = async ({ detail }: EdgeEvent) => {
        if (detail !== 'bottom' || this.state.noMore) return;
        await this.setState({ loading: true });
        const data = await logistics.getNextPage();
        await this.setState({ loading: false, noMore: !data });
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
                <p className="mb-1">
                    <a href={url} target="_blank">
                        消息来源 &gt;&gt;
                    </a>
                </p>
                {serviceArea.map(this.renderServiceArea)}
                {contacts.map(this.renderContact)}
                <p>{remark}</p>
            </Card>
        );
    };

    renderServiceArea = (serviceArea: ServiceArea) => {
        const { city, direction, personal } = serviceArea;
        return (
            <div>
                <p className="mb-1">
                    <strong>地区：</strong>
                    {city}
                </p>
                <p className="mb-1">
                    <strong>方向：</strong>
                    {DIREACTION[direction]}
                </p>
                {personal ? null : (
                    <p className="mb-1">
                        <span className="badge badge-danger">
                            不接受个人捐赠
                        </span>
                    </p>
                )}
            </div>
        );
    };

    renderContact = (contact: Contact) => {
        const { name, phone } = contact;
        return (
            <p className="mb-1">
                <a
                    className="text-center text-decoration-none"
                    href={'tel:' + phone}
                >
                    <i
                        className="fa fa-phone btn btn-sm btn-primary"
                        aria-hidden="true"
                    />
                    &nbsp;
                    {name}
                    &nbsp;
                    {phone}
                </a>
            </p>
        );
    };

    render(_, { loading, noMore }: LogisticsPageState) {
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
                        {logistics.list.map(this.renderItem)}
                    </div>
                    <p slot="bottom" className="text-center mt-2">
                        {noMore ? '没有更多数据了' : '加载更多...'}
                    </p>
                </edge-detector>
            </SpinnerBox>
        );
    }
}
