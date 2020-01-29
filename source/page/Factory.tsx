import { component, mixin, createCell } from 'web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Table } from 'boot-cell/source/Content/Table';
import { Button } from 'boot-cell/source/Form/Button';

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
        // const parsedData = Papa.parse(data, {
        //     header: true,
        //     transform: function(value) {
        //         console.log(value);
        //         return 'aaa';
        //     }
        // }).data;
        // console.log(parsedData);

        await this.setState({ loading: false, list: data });
    }

    render(_, { loading, list }: FactoryPageState) {
        return (
            <SpinnerBox cover={loading}>
                <h2>物流公司</h2>
            </SpinnerBox>
        );
    }
}
