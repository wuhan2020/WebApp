import { component, createCell, mixin } from 'web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Table } from 'boot-cell/source/Content/Table';
import { Button } from 'boot-cell/source/Form/Button';

import { repository } from '../model';

//此处需要考虑到证号可能含有字母
//COMMIT_EN:consider identify_code as potential string because there may be chars
interface Clinic {
    name: string;
    url: string;
    contacts: string;
    time: string;
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

        const list = await repository.getContents('data/Logistics.yml');

        await this.setState({ loading: false, list });
    }

    render(_, { loading, list }: ClinicPageState) {
        return (
            <SpinnerBox cover={loading}>
                <header className="d-flex justify-content-between align-item-center my-3">
                    <h2>义诊服务</h2>
                </header>

                <Table center striped hover>
                    <thead>
                        <tr>
                            <th>机构 / 个人</th>
                            <th>联系方式</th>
                            <th>接诊时间</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map(({ name, url, contacts, time }: Clinic) => (
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
                                <td className="text-nowrap">{contacts}</td>
                                <td className="text-nowrap">{time}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </SpinnerBox>
        );
    }
}
