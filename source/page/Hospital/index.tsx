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
import {
    area,
    session,
    suppliesRequirement,
    SuppliesRequirement
} from '../../model';

interface AreaFilter {
    province?: string;
    city?: string;
    district?: string;
}

interface HospitalPageState {
    loading?: boolean;
    noMore?: boolean;
    filter?: AreaFilter;
}

@observer
@component({
    tagName: 'hospital-page',
    renderTarget: 'children'
})
export class HospitalPage extends mixin<{}, HospitalPageState>() {
    state = {
        loading: false,
        noMore: false,
        filter: {} as AreaFilter
    };

    loadMore = async ({ detail }: EdgeEvent) => {
        const { loading, noMore, filter } = this.state;

        if (detail !== 'bottom' || loading || noMore) return;

        await this.setState({ loading: true });

        const data = await suppliesRequirement.getNextPage(filter);

        await this.setState({ loading: false, noMore: !data });
    };

    async changeProvince(province: string) {
        const all = province === '全部';

        const filter = all ? {} : { province };

        await this.setState({ loading: true });

        if (!all) await area.getSubs('city', province);
        else area.cities.length = area.districts.length = 0;

        suppliesRequirement.pageIndex = suppliesRequirement.list.length = 0;
        await suppliesRequirement.getNextPage(filter);

        await this.setState({ loading: false, filter });
    }

    async changeCity(city: string) {
        const all = city === '全部',
            { province } = this.state.filter;

        const filter = all ? { province } : { province, city };

        await this.setState({ loading: true });

        if (!all) await area.getSubs('district', city);
        else area.districts.length = 0;

        suppliesRequirement.pageIndex = suppliesRequirement.list.length = 0;
        await suppliesRequirement.getNextPage(filter);

        await this.setState({ loading: false, filter });
    }

    async changeDistrict(district: string) {
        const all = district === '全部',
            { province, city } = this.state.filter;

        const filter = all ? { province, city } : { province, city, district };

        await this.setState({ loading: true });

        suppliesRequirement.pageIndex = suppliesRequirement.list.length = 0;
        await suppliesRequirement.getNextPage(filter);

        await this.setState({ loading: false, filter });
    }

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
                            list={contacts.map(({ name, number }) => ({
                                title: `${name}：+86-${number}`,
                                href: 'tel:+86-' + number
                            }))}
                        />
                    )}
                </div>

                <footer className="mt-3 text-center text-mute">
                    <a href={'tel:+86-' + mobilePhoneNumber}>
                        {mobilePhoneNumber}
                    </a>{' '}
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
                <div className="d-flex">
                    <DropMenu
                        className="mr-3 mb-3"
                        title={'省 | ' + (filter.province || '全部')}
                        list={[{ name: '全部' }, ...area.provinces].map(
                            ({ name }) => ({
                                title: name,
                                href: '#hospital',
                                onClick: () => this.changeProvince(name)
                            })
                        )}
                    ></DropMenu>
                    <DropMenu
                        className="mr-3 mb-3"
                        title={'市 | ' + (filter.city || '全部')}
                        list={[{ name: '全部' }, ...area.cities].map(
                            ({ name }) => ({
                                title: name,
                                href: '#hospital',
                                onClick: () => this.changeCity(name)
                            })
                        )}
                    ></DropMenu>
                    <DropMenu
                        className="mr-3 mb-3"
                        title={'区 | ' + (filter.district || '全部')}
                        list={[{ name: '全部' }, ...area.districts].map(
                            ({ name }) => ({
                                title: name,
                                href: '#hospital',
                                onClick: () => this.changeDistrict(name)
                            })
                        )}
                    >
                        选择
                    </DropMenu>
                </div>

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
