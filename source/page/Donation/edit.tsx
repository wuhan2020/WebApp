import { component, mixin, watch, createCell } from 'web-cell';
import { FormField } from 'boot-cell/source/Form/FormField';
import { Button } from 'boot-cell/source/Form/Button';
import { RouteRoot } from '../menu';
import {
    donationRecipient,
    DonationRecipient,
    history,
    BankAccount
} from '../../model';
import { Contact } from '../../service';
import { SessionBox, ContactField } from '../../component';

type DonationEditProps = DonationRecipient & { loading?: boolean };

@component({
    tagName: 'donation-edit',
    renderTarget: 'children'
})
export class DonationEdit extends mixin<{ srid: string }, DonationEditProps>() {
    @watch
    srid = '';

    state = {
        loading: false,
        name: '', //机构名
        contacts: [{} as Contact],
        accounts: [{} as BankAccount],
        url: '', //官方网址
        remark: '' //备注
    };

    async connectedCallback() {
        super.connectedCallback();

        if (!this.srid) return;

        await this.setState({ loading: true });

        const {
            name, //机构名
            url, //官方网址
            accounts, //银行相关信息
            contacts, //联系人（姓名、电话）
            remark //备注
        } = await donationRecipient.getOne(this.srid);

        this.setState({
            loading: false,
            name, //机构名
            url, //官方网址
            accounts, //银行相关信息
            contacts, //联系人（姓名、电话）
            remark //备注
        });
    }

    changeText = ({ target }: Event) => {
        const { name, value } = target as HTMLInputElement;

        this.state[name] = value;
    };

    changeAccount(index: number, event: Event) {
        event.stopPropagation();

        const { name, value } = event.target as HTMLInputElement;

        this.state.accounts[index][name] = value;
    }

    addAccount = () =>
        this.setState({ accounts: [...this.state.accounts, {}] });

    deleteAccount(index: number) {
        const { accounts } = this.state;

        accounts.splice(index, 1);

        return this.setState({ accounts });
    }

    handleSubmit = async (event: Event) => {
        event.preventDefault();

        await this.setState({ loading: true });

        const { loading, ...data } = this.state;

        try {
            await donationRecipient.update(data, this.srid);

            self.alert('发布成功！');

            history.push(RouteRoot.Donation);
        } finally {
            await this.setState({ loading: false });
        }
    };

    render(
        _,
        {
            name, //机构名
            url, //官方网址
            accounts, //银行相关信息
            contacts, //联系人（姓名、电话）
            remark, //备注
            loading
        }: DonationEditProps
    ) {
        return (
            <SessionBox>
                <h2>捐赠信息发布</h2>

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
                    <FormField label="银行账户信息">
                        {accounts.map(({ name, number, bank }, index) => (
                            <div
                                className="input-group my-1"
                                onChange={(event: Event) =>
                                    this.changeAccount(index, event)
                                }
                            >
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    required
                                    defaultValue={name}
                                    placeholder="户名"
                                />
                                <input
                                    type="text"
                                    className="form-control"
                                    name="number"
                                    required
                                    defaultValue={number}
                                    placeholder="账号"
                                />
                                <input
                                    type="text"
                                    className="form-control"
                                    name="bank"
                                    required
                                    defaultValue={bank}
                                    placeholder="开户行"
                                />
                                <div className="input-group-append">
                                    <Button onClick={this.addAccount}>+</Button>
                                    <Button
                                        kind="danger"
                                        disabled={!accounts[1]}
                                        onClick={() =>
                                            this.deleteAccount(index)
                                        }
                                    >
                                        -
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </FormField>

                    <ContactField
                        list={contacts}
                        onChange={({ detail }: CustomEvent) =>
                            (this.state.contacts = detail)
                        }
                    />
                    <FormField
                        is="textarea"
                        name="remark"
                        label="备注"
                        defaultValue={remark}
                    />
                    <div className="form-group mt-3">
                        <Button type="submit" block disabled={loading}>
                            提交
                        </Button>
                        <Button
                            type="reset"
                            kind="danger"
                            block
                            onClick={() => history.push(RouteRoot.Donation)}
                        >
                            取消
                        </Button>
                    </div>
                </form>
            </SessionBox>
        );
    }
}
