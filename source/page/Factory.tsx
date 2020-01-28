import { component, mixin, createCell } from 'web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Table } from 'boot-cell/source/Content/Table';
import { Button } from 'boot-cell/source/Form/Button';
import Papa from 'papaparse';

import { repository } from '../model';

interface Factory {
    name: string;
    certificate: string;
    address: string;
    category: string;
    capability: string;
    phone: string;
}

interface FactoryPageState {
    loading?: boolean;
    list?: Factory[];
}

@component({
    tagName: 'factory-page',
    renderTarget: 'children'
})
export class FactoryPage extends mixin<{}, FactoryPageState>() {
    state = { loading: true, list: [] };

    async connectedCallback() {
        super.connectedCallback();

        const data = await repository.getContents('data/FACTORY.csv');
        const parsedData = Papa.parse(data, {
            header: true,
            transform: function(value) {
                console.log(value);
                return 'aaa';
            }
        }).data;
        console.log(parsedData);

        await this.setState({ loading: false, list: parsedData });
    }

    render(_, { loading, list }: FactoryPageState) {
        return (
            <SpinnerBox cover={loading}>
                <h2>物流公司</h2>

                <Table center striped hover>
                    <thead>
                        <tr>
                            <th>厂商名字</th>
                            <th>资质证明</th>
                            <th>厂商地址</th>
                            <th>生产物资类型</th>
                            <th>产能</th>
                            <th>联系方式</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map(
                            ({
                                name,
                                certificate,
                                address,
                                category,
                                capability,
                                phone
                            }: Factory) => (
                                <tr>
                                    <td className="text-nowrap">{name}</td>
                                    <td className="text-nowrap">
                                        {certificate}
                                    </td>
                                    <td>{address}</td>
                                    <td>{category}</td>
                                    <td className="text-nowrap">
                                        {capability}
                                    </td>
                                    <td>
                                        <div className="btn-group">
                                            <Button href={'tel:' + phone}>
                                                {phone}
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
