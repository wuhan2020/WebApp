import * as clipboard from 'clipboard-polyfill';
import { component, createCell, Fragment, mixin, watch } from 'web-cell';
import { observer } from 'mobx-web-cell';

import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Card } from 'boot-cell/source/Content/Card';
import { Button } from 'boot-cell/source/Form/Button';
import { DropMenu } from 'boot-cell/source/Navigator/DropMenu';
import 'boot-cell/source/Content/EdgeDetector';
import { EdgeEvent } from 'boot-cell/source/Content/EdgeDetector';

import { relativeTimeTo, TimeUnitName } from '../../utility';
import { session, suppliesRequirement, SuppliesRequirement } from '../../model';
import { DistrictEvent, DistrictFilter } from '../../component';

interface HospitalPageState {
    loading?: boolean;
    noMore?: boolean;
}

@observer
@component({
    tagName: 'hospital-page',
    renderTarget: 'children'
})
export class HospitalPage extends mixin<{}, HospitalPageState>() {
    state = {
        loading: false,
        noMore: false
    };

    districtFilter = {};

    loadMore = async ({ detail }: EdgeEvent) => {
        const {
            state: { loading, noMore },
            districtFilter
        } = this;

        if (detail !== 'bottom' || loading || noMore) return;

        await this.setState({ loading: true });

        const data = await suppliesRequirement.getNextPage(districtFilter);

        await this.setState({ loading: false, noMore: !data });
    };

    changeDistrict = async ({ detail: { level, name } }: DistrictEvent) => {
        const { districtFilter } = this;

        if (name) districtFilter[level] = name;
        else delete districtFilter[level];

        await this.setState({ loading: true });

        suppliesRequirement.pageIndex = suppliesRequirement.list.length = 0;
        await suppliesRequirement.getNextPage(districtFilter);

        await this.setState({ loading: false });
    };

    async clip2board(raw: string) {
        await clipboard.writeText(raw);
        self.alert('已复制到剪贴板');
    }

    renderItem = ({
        createdAt,
        hospital,
        supplies = [],
        province,
        city,
        district,
        address,
        contacts,
        creator: { mobilePhoneNumber, objectId: uid },
        objectId
    }: SuppliesRequirement) => {
        const { distance, unit } = relativeTimeTo(createdAt),
            authorized =
                session.user?.objectId === uid ||
                session.hasRole('Admin') ||
                null;

        return (
            <Card
                className="mx-auto mb-4 mx-sm-1"
                style={{ minWidth: '20rem', maxWidth: '20rem' }}
                title={hospital}
            >
                <ol>
                    {supplies.map(({ name, count, remark }) => (
                        <li title={remark}>
                            {name}{' '}
                            <span className="badge badge-danger">
                                {count}个
                            </span>
                        </li>
                    ))}
                </ol>

                <div className="text-center">
                    <Button
                        onClick={() =>
                            this.clip2board(
                                province + city + district + address
                            )
                        }
                    >
                        邮寄地址
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
                                href={'hospital/edit?srid=' + objectId}
                            >
                                编辑
                            </Button>
                            <Button
                                kind="danger"
                                block
                                className="mt-3"
                                onClick={() =>
                                    suppliesRequirement.delete(objectId)
                                }
                            >
                                删除
                            </Button>
                        </Fragment>
                    )}
                </footer>
            </Card>
        );
    };

    render(_, { loading, noMore, filter }: HospitalPageState) {
        return (
            <SpinnerBox cover={loading}>
                <header className="d-flex justify-content-between align-item-center my-3">
                    <h2>医院急需物资</h2>
                    <span>
                        <Button kind="warning" href="hospital/edit">
                            需求发布
                        </Button>
                    </span>
                </header>

                <DistrictFilter onChange={this.changeDistrict} />

                <edge-detector onTouchEdge={this.loadMore}>
                    <div className="card-deck justify-content-around">
                        {suppliesRequirement.list.map(this.renderItem)}
                    </div>
                    <p slot="bottom" className="text-center mt-2">
                        {noMore ? '没有更多数据了' : '加载更多...'}
                    </p>
                </edge-detector>
            </SpinnerBox>
        );
    }
}
