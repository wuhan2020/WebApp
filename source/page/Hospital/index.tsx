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
import {
    area,
    session,
    suppliesRequirement,
    SuppliesRequirement
} from '../../model';

class AreaFilter {
    city = '全部';
    province = '全部';
    district = '全部';
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
        loading: true,
        noMore: false,
        filter: {
            city: '全部',
            province: '全部',
            district: '全部'
        }
    };

    @watch
    currentDist = {};

    loadMore = async ({ detail }: EdgeEvent) => {
        if (detail !== 'bottom' || this.state.noMore) return;
        await this.setState({ loading: true });
        const data = await suppliesRequirement.getNextPage();
        await this.setState({ loading: false, noMore: !data });
    };

    async clip2board(raw: string) {
        await clipboard.writeText(raw);
        self.alert('已复制到剪贴板');
    }

    connectedCallback(): void {
        //初始化省级行政区
        area.loadProvince();
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
        if (
            this.state.filter.province !== '全部' &&
            this.state.filter.province !== province
        ) {
            return;
        }
        if (
            this.state.filter.city !== '全部' &&
            this.state.filter.city !== city
        ) {
            return;
        }
        if (
            this.state.filter.district !== '全部' &&
            this.state.filter.district !== district
        ) {
            return;
        }

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
                <div className="d-flex justify-content-left">
                    <DropMenu
                        title={'省|' + filter.province}
                        list={area.provinceList.map(item => {
                            let name = item.name;
                            return {
                                title: name,
                                href: '#hospital',
                                onClick: async () => {
                                    console.log(name);
                                    filter.province = name;
                                    filter.district = '全部';
                                    filter.city = '全部';
                                    area.loadCities(filter.province);
                                }
                            };
                        })}
                    ></DropMenu>
                    <DropMenu
                        title={'市|' + filter.city}
                        list={area.cityList.map(item => {
                            let name = item.name;
                            return {
                                title: name,
                                href: '#hospital',
                                onClick: async () => {
                                    console.log(name);
                                    filter.city = name;
                                    filter.district = '全部';
                                    area.loadDistrict(filter.province, name);
                                }
                            };
                        })}
                    ></DropMenu>
                    <DropMenu
                        title={'区|' + filter.district}
                        list={area.districtList.map(item => {
                            let name = item.name;
                            return {
                                title: name,
                                href: '#hospital',
                                onClick: async () => {
                                    console.log(name);
                                    filter.district = name;
                                    this.currentDist = name;
                                }
                            };
                        })}
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
