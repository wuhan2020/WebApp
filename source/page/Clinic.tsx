import { component, mixin, createCell } from 'web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Table } from 'boot-cell/source/Content/Table';
import { Button } from 'boot-cell/source/Form/Button';
import { parse } from 'yaml';

import { repository } from '../model';

interface Clinic {
    name: string;
    url: string;
    notes: string;
    phones: string[];
}

interface ClinicPageState {
    loading?: boolean;
    list?: Clinic[];
}

@component({
    tagName: 'clinic-page',
    renderTarget: 'children'
})
export class ClinicPage extends mixin<{}, ClinicPageState>() {
    state = { loading: true, list: [] };

    async connectedCallback() {
        super.connectedCallback();

        const data = await repository.getContents('Clinic.yml');

        await this.setState({ loading: false, list: parse(data) });
    }

    render(_, { loading, list }: ClinicPageState) {
        return (
            <SpinnerBox cover={loading}>
                <h2>义诊</h2>

                <Table center striped hover>
                    <thead>
                        <tr>
                            <th>义诊单位或个人</th>
                            <th>联系方式</th>
                            <th>官方链接</th>
                            <th>备注</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map(({ name, phones, url, notes }: Clinic) => (
                            <tr>
                                <td className="text-nowrap">{name}</td>
                                <td>
                                    <div className="btn-group">
                                        {phones.map(item => (
                                            <Button href={'tel:' + item}>
                                                {item}
                                            </Button>
                                        ))}
                                    </div>
                                </td>
                                <td className="text-nowrap">
                                    <a target="_blank" href={url}>
                                        {url}
                                    </a>
                                </td>
                                <td className="text-nowrap">{notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </SpinnerBox>
        );
    }
}
