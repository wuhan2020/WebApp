import { component, observer } from 'web-cell';
import {
    Card,
    CardBody,
    CardFooter,
    CardTitle,
    DropdownButton,
    DropdownItem
} from 'boot-cell';

import { CardsPage } from '../../component/CardsPage';
import { AuditBar } from '../../component/AuditBar';
import { donationRecipient, BankAccount, DonationRecipient } from '../../model';

@component({ tagName: 'donation-page' })
@observer
export class DonationPage extends CardsPage<DonationRecipient> {
    scope = 'donation';
    model = donationRecipient;
    name = '❤️爱心捐赠';

    renderAccount = ({ name, number, bank }: BankAccount) => (
        <li>
            <dl className="mb-2">
                <dt>户名</dt>
                <dd>
                    <code
                        className="ms-1"
                        onClick={() => this.clip2board(name)}
                    >
                        {name}
                    </code>
                </dd>
                <dt>账号</dt>
                <dd>
                    <code
                        className="ms-1"
                        onClick={() => this.clip2board(number)}
                    >
                        {number}
                    </code>
                </dd>
                <dt>开户行</dt>
                <dd>
                    <code
                        className="ms-1"
                        onClick={() => this.clip2board(bank)}
                    >
                        {bank}
                    </code>
                </dd>
            </dl>
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
        <Card>
            <CardBody>
                <CardTitle>
                    {url ? (
                        <a
                            className="text-decoration-none"
                            target="_blank"
                            href={url}
                        >
                            {name}
                        </a>
                    ) : (
                        name
                    )}
                </CardTitle>

                <ol className="list-unstyled">
                    {accounts.map(this.renderAccount)}
                </ol>

                {remark && <p className="text-muted">{remark}</p>}

                <div className="text-center">
                    {contacts[0] && (
                        <DropdownButton
                            className="d-inline-block ms-3"
                            variant="primary"
                            // alignType="right"
                            caption="联系方式"
                        >
                            {contacts.map(({ name, phone }) => (
                                <DropdownItem key={name} href={'tel:' + phone}>
                                    {name}：{phone}
                                </DropdownItem>
                            ))}
                        </DropdownButton>
                    )}
                </div>
            </CardBody>
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
