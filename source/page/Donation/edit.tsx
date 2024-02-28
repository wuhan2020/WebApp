import { WebCell, component, attribute, observer } from 'web-cell';
import { observable } from 'mobx';
import {
    FormField,
    InputGroup,
    FormGroup,
    FormLabel,
    FormControl,
    Button
} from 'boot-cell';

import { RouteRoot } from '../data/menu';
import { donationRecipient, DonationRecipient, BankAccount } from '../../model';
import { Contact } from '../../service';
import { SessionBox } from '../../component/SessionBox';
import { ContactField } from '../../component/ContactField';

export interface DonationEditProps {
    dataId: string;
}

export interface DonationEdit extends WebCell<DonationEditProps> {}

@component({ tagName: 'donation-edit' })
@observer
export class DonationEdit
    extends HTMLElement
    implements WebCell<DonationEditProps>
{
    @attribute
    @observable
    accessor dataId = '';

    @observable
    accessor state = {
        name: '', //机构名
        contacts: [{} as Contact],
        accounts: [{} as BankAccount],
        url: '', //官方网址
        remark: '' //备注
    } as DonationRecipient;

    async mountedCallback() {
        if (!this.dataId) return;

        const {
            name, //机构名
            url, //官方网址
            accounts, //银行相关信息
            contacts, //联系人（姓名、电话）
            remark //备注
        } = await donationRecipient.getOne(this.dataId);

        this.state = { name, url, accounts, contacts, remark };
    }

    changeText = ({ target }: Event) => {
        const { name, value } = target as HTMLInputElement;

        this.state = { ...this.state, [name]: value };
    };

    changeAccount(index: number, event: Event) {
        event.stopPropagation();

        const { name, value } = event.target as HTMLInputElement,
            { accounts } = this.state;

        this.state.accounts = [
            ...accounts.slice(0, index),
            { ...accounts[index], [name]: value },
            ...accounts.slice(index + 1)
        ];
    }

    addAccount = () =>
        (this.state = {
            ...this.state,
            accounts: [...this.state.accounts, {} as BankAccount]
        });

    deleteAccount(index: number) {
        const { accounts } = this.state;

        this.state.accounts = [
            ...accounts.slice(0, index),
            ...accounts.slice(index + 1)
        ];
    }

    handleSubmit = async (event: Event) => {
        event.preventDefault();

        const { accounts, contacts, ...data } = this.state;

        await donationRecipient.update(
            {
                ...data,
                accounts: accounts.filter(
                    ({ name, number, bank }) =>
                        name?.trim() && number?.trim() && bank?.trim()
                ),
                contacts: contacts.filter(
                    ({ name, phone }) => name?.trim() && phone?.trim()
                )
            },
            this.dataId
        );

        self.alert('提交成功，工作人员审核后即可查看');

        location.hash = RouteRoot.Donation;
    };

    render() {
        const { name, url, accounts, contacts, remark } = this.state;

        return (
            <SessionBox>
                <h2>捐赠信息发布</h2>
                {/* @ts-ignore */}
                <form onChange={this.changeText} onSubmit={this.handleSubmit}>
                    <FormField
                        name="name"
                        required
                        defaultValue={name}
                        label="机构名称"
                    />
                    <FormField
                        name="url"
                        required
                        defaultValue={url}
                        label="官方网址"
                        placeholder="信息发布源链接"
                    />
                    <FormGroup>
                        <FormLabel>银行账户信息</FormLabel>

                        {accounts.map(({ name, number, bank }, index) => (
                            <InputGroup
                                className="my-1"
                                onChange={(event: Event) =>
                                    this.changeAccount(index, event)
                                }
                            >
                                <FormControl
                                    name="name"
                                    required
                                    defaultValue={name}
                                    placeholder="户名"
                                />
                                <FormControl
                                    name="number"
                                    required
                                    defaultValue={number}
                                    placeholder="账号"
                                />
                                <FormControl
                                    name="bank"
                                    required
                                    defaultValue={bank}
                                    placeholder="开户行"
                                />
                                <Button
                                    variant="primary"
                                    onClick={this.addAccount}
                                >
                                    +
                                </Button>
                                <Button
                                    variant="danger"
                                    disabled={!accounts[1]}
                                    onClick={() => this.deleteAccount(index)}
                                >
                                    -
                                </Button>
                            </InputGroup>
                        ))}
                    </FormGroup>

                    <ContactField
                        list={contacts}
                        onChange={({ detail }: CustomEvent) =>
                            (this.state.contacts = detail)
                        }
                    />
                    <FormField
                        as="textarea"
                        name="remark"
                        label="备注"
                        defaultValue={remark}
                    />
                    <div className="form-group mt-3 d-flex flex-column">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={donationRecipient.loading}
                        >
                            提交
                        </Button>
                        <Button
                            type="reset"
                            variant="danger"
                            onClick={() => (location.hash = RouteRoot.Donation)}
                        >
                            取消
                        </Button>
                    </div>
                </form>
            </SessionBox>
        );
    }
}
