import { component, mixin, createCell, Fragment } from 'web-cell';
import { observer } from 'mobx-web-cell';
import 'boot-cell/source/Content/EdgeDetector';
import { EdgeEvent } from 'boot-cell/source/Content/EdgeDetector';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Card } from 'boot-cell/source/Content/Card';
import { Button } from 'boot-cell/source/Form/Button';

import { clinic, Clinic, session } from '../../model';
import { relativeTimeTo, TimeUnitName } from '../../utility';

interface ClinicListState {
    loading?: boolean;
    noMore?: boolean;
}

@observer
@component({
    tagName: 'clinic-list',
    renderTarget: 'children'
})
export class ClinicList extends mixin<{}, ClinicListState>() {
    state = { loading: false, noMore: false };

    loadMore = async ({ detail }: EdgeEvent) => {
        const {
            state: { loading, noMore }
        } = this;

        if (detail !== 'bottom' || loading || noMore) return;

        await this.setState({ loading: true });

        const data = await clinic.getNextPage();

        await this.setState({ loading: false, noMore: !data });
    };

    renderItem = ({
        url,
        name,
        startTime,
        endTime,
        contacts,
        remark,
        createdAt,
        creator: { objectId: uid, mobilePhoneNumber },
        objectId
    }: Clinic) => {
        const { distance, unit } = relativeTimeTo(createdAt),
            authorized =
                session.user?.objectId === uid ||
                session.hasRole('Admin') ||
                null;

        return (
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

                <footer className="mt-3 text-center text-mute">
                    <a href={'tel:' + mobilePhoneNumber}>{mobilePhoneNumber}</a>{' '}
                    发布于 {Math.abs(distance)} {TimeUnitName[unit]}前
                    {authorized && (
                        <Fragment>
                            <Button
                                kind="warning"
                                block
                                className="mt-3"
                                href={'clinic/edit?cid=' + objectId}
                            >
                                编辑
                            </Button>
                            <Button
                                kind="danger"
                                block
                                className="mt-3"
                                onClick={() => clinic.delete(objectId)}
                            >
                                删除
                            </Button>
                        </Fragment>
                    )}
                </footer>
            </Card>
        );
    };

    render(_, { loading, noMore }: ClinicListState) {
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
                        {clinic.list.map(this.renderItem)}
                    </SpinnerBox>
                    <p slot="bottom" className="text-center mt-2">
                        {noMore ? '没有更多数据了' : '加载更多...'}
                    </p>
                </edge-detector>
            </Fragment>
        );
    }
}
