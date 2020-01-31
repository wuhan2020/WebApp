import { component, mixin, createCell, templateOf } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Table } from 'boot-cell/source/Content/Table';
import { Button } from 'boot-cell/source/Form/Button';
import { EdgeEvent } from 'boot-cell/source/Content/EdgeDetector';

import { logistics, LogisticsItem, ServiceArea } from '../../model';

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
        const data = await logistics.getNextPage();
        await this.setState({ loading: false, noMore: !data });
    };

    render(_, { loading, list, noMore }: LogisticsPageState) {
        return (
            <SpinnerBox cover={loading}>
                <div className="container">
                    <div className="row">
                        <h2 className="col-auto mr-auto">物流公司</h2>
                        <div className="col-auto">
                            <Button
                                className=" btn btn-success"
                                href="logistics/edit"
                            >
                                物流发布
                            </Button>
                        </div>
                    </div>
                </div>

                <edge-detector onTouchEdge={this.loadMore}>
                    <Table center striped hover>
                        <thead>
                            <tr>
                                <th>名称</th>
                                <th>区域</th>
                                <th>电话</th>
                                <th>备注</th>
                                {/* <th>操作</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {logistics.list.map(
                                ({
                                    url,
                                    name,
                                    serviceArea,
                                    contacts,
                                    remark,
                                    objectId
                                }: LogisticsItem) => (
                                    <tr>
                                        <td className="text-nowrap">
                                            {url ? (
                                                <a target="_blank" href={url}>
                                                    {name}
                                                </a>
                                            ) : (
                                                name
                                            )}
                                        </td>
                                        <td className="text-nowrap">
                                            {serviceArea.map(
                                                ({
                                                    city,
                                                    direction,
                                                    personal
                                                }: ServiceArea) => {
                                                    return (
                                                        <div>
                                                            <div
                                                                style={{
                                                                    paddingTop:
                                                                        '5px'
                                                                }}
                                                            >
                                                                地区：{city}
                                                            </div>
                                                            <div
                                                                style={{
                                                                    paddingTop:
                                                                        '10px'
                                                                }}
                                                            >
                                                                方向：
                                                                {
                                                                    DIREACTION[
                                                                        direction
                                                                    ]
                                                                }
                                                            </div>
                                                            <div
                                                                style={{
                                                                    paddingTop:
                                                                        '10px'
                                                                }}
                                                            >
                                                                {personal
                                                                    ? '接受个人捐赠'
                                                                    : '不接受个人捐赠'}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </td>
                                        <td className="text-nowrap">
                                            {contacts.map(item => (
                                                <div
                                                    style={{ padding: '5px 0' }}
                                                >
                                                    <Button
                                                        className="btn btn-primary"
                                                        href={
                                                            'tel:' + item.phone
                                                        }
                                                    >
                                                        {item.name}
                                                    </Button>
                                                </div>
                                            ))}
                                        </td>
                                        <td
                                            className="text-wrap"
                                            style={{ maxWidth: '150px' }}
                                        >
                                            {remark}
                                        </td>
                                        {/* <td className="text-nowrap">
                                            <Button
                                                className="btn-warning"
                                                href={
                                                    'logistics/edit?srid=' +
                                                    objectId
                                                }
                                            >
                                                编辑
                                            </Button>
                                            <Button
                                                style={{ marginLeft: '10px' }}
                                                className="btn-danger"
                                                onClick={() =>
                                                    logistics.delete(objectId)
                                                }
                                            >
                                                删除
                                            </Button>
                                        </td> */}
                                    </tr>
                                )
                            )}
                        </tbody>
                    </Table>
                    <p slot="bottom" className="text-center mt-2">
                        {noMore ? '没有更多数据了' : '加载更多...'}
                    </p>
                </edge-detector>
            </SpinnerBox>
        );
    }
}
