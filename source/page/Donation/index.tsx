import { component, mixin, createCell } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { Button } from 'boot-cell/source/Form/Button';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Table } from 'boot-cell/source/Content/Table';
import { DonationStore } from '../../model';

interface Contact {
    name: string;
    phone: string;
}
interface DonationItem {
    organization: string; //机构名
    website?: string; //官方网址
    bankName: string; //开户行
    accountNo: string; //银行账号
    accountName: string; //户名
    contacts?: Contact[]; //联系人（姓名、电话）
    comments: string; //备注
}
interface DonationPageState {
    loading?: boolean;
    list?: DonationItem[];
}
@observer
@component({
    tagName: 'donation-page',
    renderTarget: 'children'
})
export class DonationPage extends mixin<{}, DonationPageState>() {
    state = { loading: true, list: [] };

    async connectedCallback() {
        super.connectedCallback();

        const data = await DonationStore.getResultPage();

        await this.setState({ loading: false, list: data.result });
    }

    render(_, { loading, list }: DonationPageState) {
        return (
            <SpinnerBox cover={loading}>
                <h2>❤️❤️爱心捐赠❤️❤️</h2>
                <Table center striped hover>
                    <thead>
                        <tr>
                            <th>机构名</th>
                            <th>官方网址</th>
                            <th>开户行</th>
                            <th>银行账号</th>
                            <th>户名</th>
                            <th>联系人（姓名、电话）</th>
                            <th>备注</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map(
                            ({
                                organization,
                                website,
                                bankName,
                                accountNo,
                                accountName,
                                contacts,
                                comments
                            }: DonationItem) => (
                                <tr>
                                    <td className="text-nowrap">
                                        ❤️
                                        {website ? (
                                            <a target="_blank" href={website}>
                                                ️️ {organization}
                                            </a>
                                        ) : (
                                            organization
                                        )}
                                    </td>
                                    <td className="text-nowrap">{bankName}</td>
                                    <td className="text-nowrap">
                                        ❤️{accountNo}
                                    </td>
                                    <td>
                                        <div className="text-nowrap">
                                            ❤️{accountName}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-nowrap">
                                            ❤️{contacts && '--'}
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            {contacts.map(item => (
                                                <Button
                                                    href={'tel:' + item.phone}
                                                >
                                                    {item.name}:{item.phone}
                                                </Button>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-nowrap">
                                            ❤️️{comments}
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
