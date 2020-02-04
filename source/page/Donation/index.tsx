import * as clipboard from 'clipboard-polyfill';
import { component, mixin, createCell, Fragment } from 'web-cell';
import { observer } from 'mobx-web-cell';

import { Button } from 'boot-cell/source/Form/Button';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import 'boot-cell/source/Content/EdgeDetector';
import { EdgeEvent } from 'boot-cell/source/Content/EdgeDetector';
import { Card } from 'boot-cell/source/Content/Card';
import { DropMenu } from 'boot-cell/source/Navigator/DropMenu';

import { AuditBar } from '../../component/AuditBar';
import { donationRecipient, BankAccount, DonationRecipient } from '../../model';

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

    async clip2board(raw: string) {
        await clipboard.writeText(raw);

        self.alert('已复制到剪贴板');
    }

    renderAccount = ({ name, number, bank }: BankAccount) => (
        <li>
            <ul className="list-unstyled mb-2">
                <li>
                    户名
                    <code
                        className="ml-1"
                        onClick={() => this.clip2board(name)}
                    >
                        {name}
                    </code>
                </li>
                <li>
                    账号
                    <code
                        className="ml-1"
                        onClick={() => this.clip2board(number)}
                    >
                        {number}
                    </code>
                </li>
                <li>
                    开户行
                    <code
                        className="ml-1"
                        onClick={() => this.clip2board(bank)}
                    >
                        {bank}
                    </code>
                </li>
            </ul>
        </li>
    );

    renderItem = ({
        url,
        name,
        accounts,
        remark,
        contacts,
        ...rest
    }: DonationRecipient) => (
        <Card
            className="mx-auto mb-4 mx-sm-1"
            style={{ minWidth: '20rem', maxWidth: '20rem' }}
            title={
                url ? (
                    <a target="_blank" href={url}>
                        {name}
                    </a>
                ) : (
                    name
                )
            }
        >
            <ol className="list-unstyled">
                {accounts.map(this.renderAccount)}
            </ol>

            {remark && <p className="text-muted">{remark}</p>}

            <div className="text-center">
                {contacts && (
                    <DropMenu
                        className="d-inline-block ml-3"
                        alignType="right"
                        title="联系方式"
                        list={contacts.map(({ name, phone }) => ({
                            title: `${name}：${phone}`,
                            href: 'tel:' + phone
                        }))}
                    />
                )}
            </div>

            <AuditBar scope="donation" model={donationRecipient} {...rest} />
        </Card>
    );

    render(_, { loading, noMore }: DonationPageState) {
        return (
            <Fragment>
                <header className="d-flex justify-content-between align-item-center my-3">
                    <h2>❤️爱心捐赠</h2>
                    <span>
                        <Button kind="success" href="donation/edit">
                            捐赠发布
                        </Button>
                    </span>
                </header>

                <edge-detector onTouchEdge={this.loadMore}>
                    <SpinnerBox
                        cover={loading}
                        className="card-deck justify-content-around"
                    >
                        {donationRecipient.list.map(this.renderItem)}
                    </SpinnerBox>
                    <p slot="bottom" className="text-center mt-2">
                        {noMore ? '没有更多数据了' : '加载更多...'}
                    </p>
                </edge-detector>
            </Fragment>
        );
    }
}
