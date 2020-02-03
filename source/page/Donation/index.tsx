import { component, mixin, createCell } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { Button } from 'boot-cell/source/Form/Button';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Table } from 'boot-cell/source/Content/Table';
import { donationRecipient, DonationRecipient } from '../../model';
import 'boot-cell/source/Content/EdgeDetector';
import { EdgeEvent } from 'boot-cell/source/Content/EdgeDetector';

interface DonationPageState {
    loading?: boolean;
    noMore?: boolean;
}

@observer
@component({
    tagName: 'donation-page',
    renderTarget: 'children'
})
export class DonationPage extends mixin<{}, DonationPageState>() {
    state = { loading: false, noMore: false };

    loadMore = async ({ detail }: EdgeEvent) => {
        const { loading, noMore } = this.state;

        if (detail !== 'bottom' || loading || noMore) return;

        await this.setState({ loading: true });

        const data = await donationRecipient.getNextPage();

        await this.setState({ loading: false, noMore: !data });
    };

    render(_, { loading, noMore }: DonationPageState) {
        return (
            <SpinnerBox cover={loading}>
                <header className="d-flex justify-content-between align-item-center my-3">
                    <h2>❤️爱心捐赠</h2>
                    <span>
                        <Button kind="success" href="donation/edit">
                            捐赠发布
                        </Button>
                    </span>
                </header>

                <edge-detector onTouchEdge={this.loadMore}>
                    <Table center striped hover>
                        <thead>
                            <tr>
                                <th> ❤️机构名称</th>
                                <th>银行账户</th>
                                <th>联系人</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donationRecipient.list.map(
                                ({
                                    name, //机构名
                                    url, //官方网址
                                    accounts, //银行相关信息
                                    contacts, //联系人（姓名、电话）
                                    remark //备注
                                }: DonationRecipient) => (
                                    <tr>
                                        <td className="text-nowrap">
                                            {url ? (
                                                <a target="_blank" href={url}>
                                                    ️️ {name}
                                                </a>
                                            ) : (
                                                name
                                            )}
                                        </td>
                                        <td className="text-left">
                                            {accounts.map(
                                                ({ name, number, bank }) => (
                                                    <ul className="list-unstyled">
                                                        <li>户名：{name}</li>
                                                        <li>账号：{number}</li>
                                                        <li>开户行：{bank}</li>
                                                    </ul>
                                                )
                                            )}
                                        </td>
                                        <td>
                                            {contacts.map(({ name, phone }) => (
                                                <Button href={'tel:' + phone}>
                                                    {name}：{phone}
                                                </Button>
                                            ))}
                                        </td>
                                        <td>
                                            <div className="text-nowrap">
                                                {remark}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </Table>
                    <p slot="bottom" className="text-center mt-2">
                        {noMore ? '没有更多数据了' : '加载更多...'}
                    </p>
                </edge-detector>
            </SpinnerBox>
        );
    }
}
