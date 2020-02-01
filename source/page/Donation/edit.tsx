import { component, mixin, watch, createCell } from 'web-cell';
import { FormField } from 'boot-cell/source/Form/FormField';
import { Button } from 'boot-cell/source/Form/Button';
import { RouteRoot } from '../menu';
import {
    DonationStore,
    DonationItem,
    history,
    Contact,
    BankAccount
} from '../../model';
import { SessionBox } from '../../component';

type DonationEditProps = DonationItem & { loading?: boolean };

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
        bankNo: '',
        bankAddress: '',
        bankName: '',
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
        } = await DonationStore.getOne(this.srid);

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

    handleSubmit = async (event: Event) => {
        event.preventDefault();
        const {
            bankName: name,
            bankNo: number,
            bankAddress: bank
        } = this.state;

        await this.setState({ loading: true });
        try {
            await DonationStore.update(
                Object.assign(this.state, {
                    accounts: [{ name, number, bank }]
                }),
                this.srid
            );
            self.alert('发布成功！');
            history.push(RouteRoot.Donation);
        } finally {
            await this.setState({ loading: false });
        }
    };
    changeContact(index: number, event: Event) {
        event.stopPropagation();

        const { name, value } = event.target as HTMLInputElement;

        this.state.contacts[index][name] = value;
    }
    addContact = () =>
        this.setState({
            contacts: [...this.state.contacts, { name: '', number: '' }]
        });

    deleteContact(index: number) {
        const { contacts } = this.state;

        contacts.splice(index, 1);

        this.setState({ contacts });
    }
    render(
        _,
        {
            name, //机构名
            url, //官方网址
            accounts, //银行相关信息
            contacts, //联系人（姓名、电话）,
            bankNo,
            bankAddress,
            bankName,
            remark, //备注
            loading
        }: DonationEditProps
    ) {
        return (
            <SessionBox>
                <h2>捐赠信息发布</h2>
                <form onChange={this.changeText} onSubmit={this.handleSubmit}>
                    <FormField label="机构名称">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                required
                                defaultValue={name}
                                placeholder="请输入机构名称"
                            />
                        </div>
                    </FormField>
                    <FormField
                        name="url"
                        required
                        defaultValue={url}
                        placeholder="信息发布源链接"
                        label="信息发布源链接"
                    />
                    <FormField label="银行账户信息">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                name="bankName"
                                required
                                defaultValue={bankName}
                                placeholder="请输入开户用户名"
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                name="bankNo"
                                required
                                defaultValue={bankNo}
                                placeholder="请输入开户账号"
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                name="bankAddress"
                                required
                                defaultValue={bankAddress}
                                placeholder="请输入开户行"
                            />
                        </div>
                    </FormField>

                    <FormField label="联系方式">
                        {contacts.map(({ name, number }, index) => (
                            <div
                                className="input-group my-1"
                                onChange={(event: Event) =>
                                    this.changeContact(index, event)
                                }
                            >
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={name}
                                    placeholder="姓名"
                                />
                                <input
                                    type="tel"
                                    className="form-control"
                                    name="number"
                                    value={number}
                                    placeholder="电话号码（不含 +86 和区号的先导 0）"
                                />
                                <div className="input-group-append">
                                    <Button onClick={this.addContact}>+</Button>
                                    <Button
                                        kind="danger"
                                        disabled={!contacts[1]}
                                        onClick={() =>
                                            this.deleteContact(index)
                                        }
                                    >
                                        -
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </FormField>

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
