import * as clipboard from 'clipboard-polyfill';
import { component, mixin, createCell, Fragment } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Card } from 'boot-cell/source/Content/Card';
import { Button } from 'boot-cell/source/Form/Button';
import { DropMenu } from 'boot-cell/source/Navigator/DropMenu';
import 'boot-cell/source/Content/EdgeDetector';
import { EdgeEvent } from 'boot-cell/source/Content/EdgeDetector';

import { relativeTimeTo, TimeUnitName } from '../../utility';
import { hotel, session, Hotel } from '../../model';
import { District, DistrictEvent, DistrictFilter } from '../../component';

interface HotelPageState {
    loading?: boolean;
    noMore?: boolean;
}

@observer
@component({
    tagName: 'hotel-page',
    renderTarget: 'children'
})
export class HotelPage extends mixin<{}, HotelPageState>() {
    state = { loading: false, noMore: false };

    districtFilter: District;

    loadMore = async ({ detail }: EdgeEvent) => {
        const {
            state: { loading, noMore },
            districtFilter
        } = this;

        if (detail !== 'bottom' || loading || noMore) return;

        await this.setState({ loading: true });

        const data = await hotel.getNextPage(districtFilter);

        await this.setState({ loading: false, noMore: !data });
    };

    changeDistrict = async ({ detail }: DistrictEvent) => {
        this.districtFilter = detail;

        await this.setState({ loading: true });

        hotel.clear();
        const data = await hotel.getNextPage(detail);

        await this.setState({ loading: false, noMore: !data });
    };

    async clip2board(raw: string) {
        await clipboard.writeText(raw);

        self.alert('已复制到剪贴板');
    }

    renderItem = ({
        name,
        address,
        capacity,
        contacts,
        creator: { mobilePhoneNumber, objectId: uid },
        objectId,
        createdAt
    }: Hotel) => {
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
                <div>详细地址：{address}</div>
                <p>可接待人数：{capacity}</p>
                <div className="text-center">
                    <Button onClick={() => this.clip2board(address)}>
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
                    发布于 {Math.abs(distance)} {TimeUnitName[unit]}前
                    {authorized && (
                        <Fragment>
                            <Button
                                kind="warning"
                                block
                                className="mt-3"
                                href={'hotel/edit?srid=' + objectId}
                            >
                                编辑
                            </Button>
                            <Button
                                kind="danger"
                                block
                                className="mt-3"
                                onClick={() => {
                                    hotel.delete(objectId);
                                }}
                            >
                                删除
                            </Button>
                        </Fragment>
                    )}
                </footer>
            </Card>
        );
    };

    render(_, { loading, noMore }: HotelPageState) {
        return (
            <SpinnerBox cover={loading}>
                <header className="d-flex justify-content-between align-item-center my-3">
                    <h2>湖北同胞住宿指南</h2>
                    <span>
                        <Button kind="warning" href="hotel/edit">
                            住宿发布
                        </Button>
                    </span>
                </header>

                <DistrictFilter onChange={this.changeDistrict} />

                <edge-detector onTouchEdge={this.loadMore}>
                    <div className="card-deck justify-content-around">
                        {hotel.list.map(this.renderItem)}
                    </div>
                    <p slot="bottom" className="text-center mt-2">
                        {noMore ? '没有更多数据了' : '加载更多...'}
                    </p>
                </edge-detector>
            </SpinnerBox>
        );
    }
}
