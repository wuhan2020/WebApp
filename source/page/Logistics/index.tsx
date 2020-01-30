import { component, mixin, createCell, templateOf } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Table } from 'boot-cell/source/Content/Table';
import { Button } from 'boot-cell/source/Form/Button';

import { logistics, LogisticsItem, ServiceArea } from '../../model';

interface LogisticsPageState {
    loading?: boolean;
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
    state = { loading: true, list: [] };

    async connectedCallback() {
        super.connectedCallback();
        const data = await logistics.getList();
        await this.setState({ loading: false, list: data });
    }

    render(_, { loading, list }: LogisticsPageState) {
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

                <Table center striped hover>
                    <thead>
                        <tr>
                            <th>名称</th>
                            <th>区域</th>
                            <th>电话</th>
                            <th>备注</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map(
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
                                                            地区: {city}
                                                        </div>
                                                        <div
                                                            style={{
                                                                paddingTop:
                                                                    '10px'
                                                            }}
                                                        >
                                                            方向:
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
                                            <div style={{ padding: '5px 0' }}>
                                                <Button
                                                    href={'tel:' + item.phone}
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
                                    <td className="text-nowrap">
                                        <div style={{ padding: '5px 0' }}>
                                            <Button
                                                className="btn-warning"
                                                href={
                                                    'logistics/edit?srid=' +
                                                    objectId
                                                }
                                            >
                                                编辑
                                            </Button>
                                        </div>
                                        <div style={{ padding: '5px 0' }}>
                                            <Button
                                                className="btn-danger"
                                                onClick={() =>
                                                    logistics.delete(objectId)
                                                }
                                            >
                                                删除
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </Table>
            </SpinnerBox>
        );
    }
}
