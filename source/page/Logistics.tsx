import { component, mixin, createCell } from 'web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Table } from 'boot-cell/source/Content/Table';
import { Button } from 'boot-cell/source/Form/Button';

import { repository } from '../model';

interface Logistics {
    name: string;
    url: string;
    area: string;
    capability: string;
    phones: string[];
}

interface LogisticsPageState {
    loading?: boolean;
    list?: Logistics[];
}

@component({
    tagName: 'logistics-page',
    renderTarget: 'children'
})
export class LogisticsPage extends mixin<{}, LogisticsPageState>() {
    state = { loading: true, list: [] };

    async connectedCallback() {
        super.connectedCallback();

        const list = await repository.getContents('data/Logistics.yml');

        await this.setState({ loading: false, list });
    }

    render(_, { loading, list }: LogisticsPageState) {
        return (
            <SpinnerBox cover={loading}>
                <h2>物流公司</h2>

                <Table center striped hover>
                    <thead>
                        <tr>
                            <th>名称</th>
                            <th>区域</th>
                            <th>能力</th>
                            <th>电话</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map(
                            ({
                                url,
                                name,
                                area,
                                capability,
                                phones
                            }: Logistics) => (
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
                                    <td className="text-nowrap">{area}</td>
                                    <td className="text-nowrap">
                                        {capability}
                                    </td>
                                    <td>
                                        <div className="btn-group">
                                            {phones.map(item => (
                                                <Button href={'tel:' + item}>
                                                    {item}
                                                </Button>
                                            ))}
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
