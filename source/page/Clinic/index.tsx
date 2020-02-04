import { component, mixin, createCell, Fragment } from 'web-cell';
import { observer } from 'mobx-web-cell';

import 'boot-cell/source/Content/EdgeDetector';
import { EdgeEvent } from 'boot-cell/source/Content/EdgeDetector';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Card } from 'boot-cell/source/Content/Card';
import { Button } from 'boot-cell/source/Form/Button';

import { AuditBar } from '../../component/AuditBar';
import { clinic, Clinic } from '../../model';

@observer
@component({
    tagName: 'clinic-list',
    renderTarget: 'children'
})
export class ClinicList extends mixin() {
    loadMore = ({ detail }: EdgeEvent) => {
        if (detail === 'bottom') return clinic.getNextPage({});
    };

    renderItem = ({
        url,
        name,
        startTime,
        endTime,
        contacts,
        remark,
        ...rest
    }: Clinic) => (
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
                每日接诊起止时间：{startTime} ~ {endTime}
            </p>
            {contacts[0] && (
                <ol className="list-unstyled">
                    {contacts.map(({ name, phone }) => (
                        <li>
                            <a href={'tel:' + phone}>
                                <i className="fa fa-phone d-inline-block bg-primary text-white p-1 rounded" />{' '}
                                {name}：{phone}
                            </a>
                        </li>
                    ))}
                </ol>
            )}
            {remark && <p className="text-muted">{remark}</p>}

            <AuditBar scope="clinic" model={clinic} {...rest} />
        </Card>
    );

    render() {
        const { loading, list, noMore } = clinic;

        return (
            <Fragment>
                <header className="d-flex justify-content-between">
                    <h2>义诊服务</h2>
                    <span>
                        <Button kind="warning" href="clinic/edit">
                            发布
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
