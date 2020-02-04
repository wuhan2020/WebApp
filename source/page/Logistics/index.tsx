import { component, mixin, createCell, Fragment } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Card } from 'boot-cell/source/Content/Card';
import { Button } from 'boot-cell/source/Form/Button';
import { EdgeEvent } from 'boot-cell/source/Content/EdgeDetector';

import { AuditBar } from '../../component';
import { logistics, Logistics, ServiceArea } from '../../model';
import { Contact } from '../../service';

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
export class LogisticsPage extends mixin() {
    loadMore = ({ detail }: EdgeEvent) => {
        if (detail === 'bottom') return logistics.getNextPage({});
    };

    renderItem = ({
        url,
        name,
        serviceArea,
        contacts,
        remark,
        ...rest
    }: Logistics) => (
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
            {serviceArea.map(this.renderServiceArea)}

            {contacts.map(this.renderContact)}

            <p className="text-muted">{remark}</p>

            <AuditBar scope="logistics" model={logistics} {...rest} />
        </Card>
    );

    renderServiceArea = ({ city, direction, personal }: ServiceArea) => (
        <Fragment>
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
                    <span className="badge badge-danger">不接受个人捐赠</span>
                </p>
            )}
        </Fragment>
    );

    renderContact = ({ name, phone }: Contact) => (
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

    render() {
        const { loading, list, noMore } = logistics;

        return (
            <Fragment>
                <header className="d-flex justify-content-between align-items-center my-3">
                    <h2>物流公司</h2>
                    <span>
                        <Button kind="success" href="logistics/edit">
                            物流发布
                        </Button>
                    </span>
                </header>

                <edge-detector onTouchEdge={this.loadMore}>
                    <SpinnerBox
                        cover={loading}
                        className="card-deck justify-content-around"
                    >
                        {list.map(this.renderItem)}
                    </SpinnerBox>
                    <p slot="bottom" className="text-center mt-2">
                        {noMore ? '没有更多数据了' : '加载更多...'}
                    </p>
                </edge-detector>
            </Fragment>
        );
    }
}
