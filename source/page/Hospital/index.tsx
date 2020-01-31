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
import { session, SuppliesRequirement, suppliesRequirement } from '../../model';
import { getSubDistrict } from '../../model/AMap';

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
    state = { loading: true, noMore: false };
    initPage = () => {
        this.initProvince();
    };
    @watch
    filter = {
        city: '全部',
        province: '全部',
        district: '全部'
    };

    loadMore = async ({ detail }: EdgeEvent) => {
        if (detail !== 'bottom' || this.state.noMore) return;

        await this.setState({ loading: true });

        const data = await suppliesRequirement.getNextPage();

        await this.setState({ loading: false, noMore: !data });
    };
    @watch
    provinceList = [];
    @watch
    cityList = [];
    @watch
    districtList = [];
    initDistrict = async name => {
        let initArray = [{ name: '全部' }];
        this.districtList = await getSubDistrict(name);
        this.districtList = initArray.concat(this.districtList);
    };
    initCity = async name => {
        let initArray = [{ name: '全部' }];
        this.cityList = await getSubDistrict(name);
        this.cityList = initArray.concat(this.cityList);
    };
    initProvince = async () => {
        let initArray = [{ name: '全部' }];
        this.provinceList = await getSubDistrict();
        this.provinceList = initArray.concat(this.provinceList);
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
        if (
            this.filter.province !== '全部' &&
            this.filter.province !== province
        ) {
            return;
        }
        if (this.filter.city !== '全部' && this.filter.city !== city) {
            return;
        }
        if (
            this.filter.district !== '全部' &&
            this.filter.distinct !== district
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

    render(_, { loading, noMore }: HospitalPageState) {
        this.initPage();

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
                        title={'省|' + this.filter.province}
                        list={this.provinceList.map(item => {
                            let name = item.name;
                            return {
                                title: name,
                                href: '#hospital',
                                onClick: async () => {
                                    console.log(name);

                                    this.filter.province = name;
                                    this.initCity(this.filter.province);
                                }
                            };
                        })}
                    >
                        选择
                    </DropMenu>
                    <DropMenu
                        title={'市|' + this.filter.city}
                        list={this.cityList.map(item => {
                            let name = item.name;
                            return {
                                title: name,
                                href: '#hospital',
                                onClick: async () => {
                                    console.log(name);
                                    this.filter.city = name;
                                    this.initDistrict(name);
                                }
                            };
                        })}
                    >
                        选择
                    </DropMenu>
                    <DropMenu
                        title={'区|' + this.filter.district}
                        list={this.districtList.map(item => {
                            let name = item.name;
                            return {
                                title: name,
                                href: '#hospital',
                                onClick: async () => {
                                    console.log(name);
                                    this.filter.district = name;
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
