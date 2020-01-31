import { component, mixin, watch, createCell } from 'web-cell';
import { FormField } from 'boot-cell/source/Form/FormField';
import { Button } from 'boot-cell/source/Form/Button';

import { RouteRoot } from '../menu';
import { LogisticsItem, logistics, history, ServiceArea } from '../../model';
import { SessionBox } from '../../component';

type LogisticsEditProps = LogisticsItem & { loading?: boolean };

const initServiceArea: ServiceArea = {
    city: '',
    direction: 'in',
    personal: false
};

@component({
    tagName: 'logistics-edit',
    renderTarget: 'children'
})
export class LogisticsEdit extends mixin<
    { srid: string },
    LogisticsEditProps
>() {
    @watch
    srid = '';

    state = {
        loading: false,
        name: '',
        url: '',
        serviceArea: [initServiceArea],
        remark: '',
        contacts: [{ name: '', phone: '' }]
    };

    async connectedCallback() {
        super.connectedCallback();

        if (!this.srid) return;
        await this.setState({ loading: true });

        const {
            name,
            url,
            serviceArea,
            remark,
            contacts
        } = await logistics.getOne(this.srid);

        this.setState({
            loading: false,
            name,
            url,
            serviceArea,
            remark,
            contacts
        });
    }

    changeText = ({ target }: Event) => {
        const { name, value } = target as HTMLInputElement;
        this.state[name] = value;
    };

    changeServiceArea(index: number, event: Event) {
        event.stopPropagation();
        const { name, value } = event.target as HTMLInputElement;
        if (name === 'personal') {
            const transToBool = {
                true: true,
                false: false
            };
            this.state.serviceArea[index]['personal'] = transToBool[value];
            return;
        }
        this.state.serviceArea[index][name] = value;
    }

    addServiceArea = () =>
        this.setState({ serviceArea: [...this.state.serviceArea, {}] });

    deleteServiceArea(index: number) {
        const { serviceArea } = this.state;
        serviceArea.splice(index, 1);
        this.setState({ serviceArea });
    }

    changeContact(index: number, event: Event) {
        event.stopPropagation();
        const { name, value } = event.target as HTMLInputElement;
        this.state.contacts[index][name] = value;
    }

    addContact = () =>
        this.setState({
            contacts: [...this.state.contacts, { name: '', phone: '' }]
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
        await logistics.update(data, this.srid);
        await this.setState({ loading: false });
        self.alert('发布成功！');
        history.push(RouteRoot.Logistics);
    };

    render(_, { name, url, serviceArea, remark, contacts, loading }) {
        return (
            <SessionBox>
                <h2>物流信息发布</h2>

                <form onChange={this.changeText} onSubmit={this.handleSubmit}>
                    <FormField
                        name="name"
                        required
                        defaultValue={name}
                        label="物流公司名称"
                        placeholder="请填写物流公司名称"
                    />
                    <FormField
                        name="url"
                        required
                        defaultValue={url}
                        label="来源链接"
                        placeholder="请填写物流来源的链接地址"
                    ></FormField>
                    <FormField label="寄送区域与其他能力">
                        {serviceArea.map(
                            (
                                { city, direction, personal }: ServiceArea,
                                index
                            ) => (
                                <div
                                    className="input-group my-1"
                                    onChange={(event: Event) =>
                                        this.changeServiceArea(index, event)
                                    }
                                >
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="city"
                                        value={city}
                                        placeholder="请输入寄送城市"
                                    />
                                    <select
                                        class="custom-select"
                                        name="direction"
                                        value={direction}
                                    >
                                        <option selected>选择寄送方向</option>
                                        <option value="in">只能寄入</option>
                                        <option value="out">只能寄出</option>
                                        <option value="both">寄入寄出</option>
                                    </select>
                                    <select
                                        class="custom-select"
                                        name="personal"
                                        value={personal}
                                    >
                                        <option selected>
                                            是否接受个人捐赠
                                        </option>
                                        <option value={true}>是</option>
                                        <option value={false}>否</option>
                                    </select>

                                    <div className="input-group-append">
                                        <Button onClick={this.addServiceArea}>
                                            +
                                        </Button>
                                        <Button
                                            kind="danger"
                                            disabled={!serviceArea[1]}
                                            onClick={() =>
                                                this.deleteServiceArea(index)
                                            }
                                        >
                                            -
                                        </Button>
                                    </div>
                                </div>
                            )
                        )}
                    </FormField>
                    <FormField label="联系方式">
                        {contacts.map(({ name, phone }, index) => (
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
                                    name="phone"
                                    value={phone}
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
                        name="remark"
                        defaultValue={remark}
                        label="备注"
                        placeholder="请填写备注信息"
                    ></FormField>

                    <div className="form-group mt-3">
                        <Button type="submit" block disabled={loading}>
                            提交
                        </Button>
                        <Button
                            type="reset"
                            kind="danger"
                            block
                            onClick={() => history.push(RouteRoot.Logistics)}
                        >
                            取消
                        </Button>
                    </div>
                </form>
            </SessionBox>
        );
    }
}
