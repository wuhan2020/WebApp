import { component, createCell, mixin } from 'web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Table } from 'boot-cell/source/Content/Table';

import { Clinic, clinic } from '../model/index';
import { Contact } from '../service/HTTP';

//此处需要考虑到证号可能含有字母
//COMMIT_EN:consider identify_code as potential string because there may be chars

interface ClinicPageState {
    loading?: boolean;
    list?: Clinic[];
}

@component({
    tagName: 'clinic-page',
    renderTarget: 'children'
})
export class ClinicPage extends mixin<{}, ClinicPageState>() {
    state = { loading: true };

    async connectedCallback() {
        super.connectedCallback();
        await this.setState({ loading: false});
    }

    async render(_, { loading }: ClinicPageState) {
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
                            <th>备注</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(await clinic.getNextPage()).map(
                            ({
                                name,
                                url,
                                contacts,
                                startTime,
                                endTime,
                                remark
                            }: Clinic) => (
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
                                        {contacts.map(
                                            ({ name, phone }: Contact) => (
                                                <span>
                                                    {name}:{phone}
                                                </span>
                                            )
                                        )}
                                    </td>
                                    <td className="text-nowrap">
                                        {startTime} - {endTime}
                                    </td>
                                    <td className="text-nowrao">{remark}</td>
                                </tr>
                            )
                        )}
                    </tbody>
                </Table>
            </SpinnerBox>
        );
    }
}
