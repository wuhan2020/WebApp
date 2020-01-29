import { component, mixin, watch, createCell } from 'web-cell';
import { FormField } from 'boot-cell/source/Form/FormField';
import { Button } from 'boot-cell/source/Form/Button';

import { RouteRoot } from '../menu';
import {
    searchAddress,
    suppliesRequirement,
    history,
    FactoryStore,
    Factory
} from '../../model';
import { SessionBox } from '../../component';

type FactoryEditProps = Factory & { loading?: boolean };

@component({
    tagName: 'factory-edit',
    renderTarget: 'children'
})
export class FactoryEdit extends mixin<{ srid: string }, FactoryEditProps>() {
    @watch
    srid = '';

    state = {
        loading: false,
        name: '',
        certificate: '',
        address: '',
        category: '',
        capability: '',
        contacts: [{ name: '', number: '' }]
    };

    async connectedCallback() {
        super.connectedCallback();

        if (!this.srid) return;

        await this.setState({ loading: true });

        const {
            certificate,
            address,
            category,
            capability,
            contacts
        } = await FactoryStore.getOne(this.srid);

        this.setState({
            loading: false,
            name: '',
            certificate,
            address,
            category,
            capability,
            contacts
        });
    }

    changeText = ({ target }: Event) => {
        const { name, value } = target as HTMLInputElement;

        this.state[name] = value;
    };

    searchAddress = async ({ target }: Event) => {
        const { value } = target as HTMLInputElement;

        await this.setState({ loading: true });

        const [{ pname, cityname, adname, address }] = await searchAddress(
            value
        );

        await this.setState({
            loading: false,
            address: pname + cityname + adname + address
        });
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

    handleSubmit = async (event: Event) => {
        event.preventDefault();

        await this.setState({ loading: true });

        const data = { ...this.state };
        delete data.loading;

        await suppliesRequirement.update(data, this.srid);

        await this.setState({ loading: false });

        self.alert('发布成功！');

        history.push(RouteRoot.Factory);
    };

    render(
        _,
        {
            name,
            certificate,
            address,
            category,
            capability,
            contacts,
            loading
        }: FactoryEditProps
    ) {
        return (
            <SessionBox>
                <h2>生产厂商发布</h2>

                <form onChange={this.changeText} onSubmit={this.handleSubmit}>
                    <FormField
                        name="name"
                        required
                        defaultValue={name}
                        label="厂商名字"
                        onChange={this.searchAddress}
                    />
                    <FormField
                        name="address"
                        required
                        defaultValue={address}
                        label="机构地址"
                        placeholder="先填上一项可自动搜索"
                    />
                    <FormField
                        name="certificate"
                        required
                        defaultValue={certificate}
                        label="资质证明"
                    />
                    <FormField
                        name="category"
                        required
                        defaultValue={category}
                        label="生产物资类型"
                    />
                    <FormField
                        name="capability"
                        required
                        defaultValue={capability}
                        label="产能"
                    />

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

                    <div className="form-group mt-3">
                        <Button type="submit" block disabled={loading}>
                            提交
                        </Button>
                        <Button
                            type="reset"
                            kind="danger"
                            block
                            onClick={() => history.push(RouteRoot.Factory)}
                        >
                            取消
                        </Button>
                    </div>
                </form>
            </SessionBox>
        );
    }
}
