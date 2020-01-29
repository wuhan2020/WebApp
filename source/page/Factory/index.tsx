import { component, mixin, createCell } from 'web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Table } from 'boot-cell/source/Content/Table';
import { Button } from 'boot-cell/source/Form/Button';
import { FactoryStore, Factory } from '../../model';

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

        const data = await FactoryStore.getResultPage();
        await this.setState({ loading: false, list: data });
    }

    render(_, { loading, list }: FactoryPageState) {
        return (
            <SpinnerBox cover={loading}>
                <header className="d-flex justify-content-between align-item-center my-3">
                    <h2>生产厂商</h2>
                    <span>
                        <Button kind="warning" href="factory/edit">
                            生产发布
                        </Button>
                    </span>
                </header>
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
                                contacts
                            }: Factory) => (
                                <tr>
                                    <td className="text-nowrap">{name}</td>
                                    <td className="text-nowrap">
                                        <Button
                                            href={certificate}
                                            target="_blank"
                                        >
                                            证明
                                        </Button>
                                    </td>
                                    <td>{address}</td>
                                    <td>{category}</td>
                                    <td className="text-nowrap">
                                        {capability}
                                    </td>
                                    <td>
                                        <div className="btn-group">
                                            {contacts.map(item => (
                                                <Button
                                                    href={'tel:' + item.number}
                                                >
                                                    {item.name || name}
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
