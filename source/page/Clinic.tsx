import { component, createCell, mixin } from 'web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Table } from 'boot-cell/source/Content/Table';
import { Button } from 'boot-cell/source/Form/Button';

import { repository } from '../model';

interface Clinic {
    name: string;
    url: string;
    contacts: string;
    startTime: string;
    endTime: string;
    remark: string
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

        const list = await repository.getContents('data/Clinic.yml');

        await this.setState({ loading: false, list });
    }

    render(_, { loading, list }: ClinicPageState) {
        return (
            <SpinnerBox cover={loading}>
                <h2>义诊服务</h2>

                <Table center striped hover>
                    <thead>
                    <tr>
                        <th>机构/个人名</th>
                        <th>官网网址</th>
                        <th>联系人（姓名、电话）</th>
                        <th>每日开诊时刻</th>
                        <th>每日闭诊时刻</th>
                        <th>备注</th>
                    </tr>
                    </thead>
                    <tbody>
                    {list.map(
                        ({
                             name,
                             url,
                             contacts,
                             startTime,
                             endTime,
                             remark
                         }: Clinic) => (
                            <tr>
                                {/*如不需要指向义诊机构的超链接请修改此处*/}
                                <td className="text-nowrap">
                                    {url ? (
                                        <a target="_blank" href={url}>
                                            {name}
                                        </a>
                                    ) : (
                                        name
                                    )}
                                </td>
                                <td className="text-nowrap"
                                    style="overflow:auto">{url}</td>
                                <td className="text-nowrap">{contacts}</td>
                                <td className="text-nowrap">{startTime}</td>
                                <td className="text-nowrap">{endTime}</td>
                                <td className="text-nowrap">{remark}</td>
                            </tr>
                        )
                    )}
                    </tbody>
                </Table>
            </SpinnerBox>
        );
    }
}
