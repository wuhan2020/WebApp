import { component, createCell } from 'web-cell';
import { observer } from 'mobx-web-cell';

import { Card, CardFooter } from 'boot-cell/source/Content/Card';
import { DropMenu, DropMenuItem } from 'boot-cell/source/Navigator/DropMenu';

import { CardsPage, AuditBar } from '../../component';
import { donationRecipient, BankAccount, DonationRecipient } from '../../model';

@observer
@component({
    tagName: 'donation-page',
    renderTarget: 'children'
})
export class DonationPage extends CardsPage<DonationRecipient> {
    scope = 'donation';
    model = donationRecipient;
    name = '❤️爱心捐赠';

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
                {contacts[0] && (
                    <DropMenu
                        className="d-inline-block ml-3"
                        buttonColor="primary"
                        alignType="right"
                        caption="联系方式"
                    >
                        {contacts.map(({ name, phone }) => (
                            <DropMenuItem href={'tel:' + phone}>
                                {name}：{phone}
                            </DropMenuItem>
                        ))}
                    </DropMenu>
                )}
            </div>
            <CardFooter>
                <AuditBar
                    scope="donation"
                    model={donationRecipient}
                    {...rest}
                />
            </CardFooter>
        </Card>
    );
}
