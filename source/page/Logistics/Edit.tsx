import { WebCellProps, component, mixin, watch, createCell } from 'web-cell';
import { FormField } from 'boot-cell/source/Form/FormField';
import { InputGroup } from 'boot-cell/source/Form/InputGroup';
import { Field } from 'boot-cell/source/Form/Field';
import { Button } from 'boot-cell/source/Form/Button';

import { RouteRoot } from '../data/menu';
import { Logistics, logistics, history, ServiceArea } from '../../model';
import { SessionBox, ContactField } from '../../component';

const initServiceArea: ServiceArea = {
    city: '',
    direction: 'in',
    personal: false
};

export interface LogisticsEditProps extends WebCellProps {
    dataId: string;
}

@component({
    tagName: 'logistics-edit',
    renderTarget: 'children'
})
export class LogisticsEdit extends mixin<LogisticsEditProps, Logistics>() {
    @watch
    dataId = '';

    state = {
        name: '',
        url: '',
        serviceArea: [initServiceArea],
        remark: '',
        contacts: [{ name: '', phone: '' }]
    };

    async connectedCallback() {
        super.connectedCallback();

        if (!this.dataId) return;

        const {
            name,
            url,
            serviceArea,
            remark,
            contacts
        } = await logistics.getOne(this.dataId);

        this.setState({
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

        if (name === 'personal')
            this.state.serviceArea[index].personal = JSON.parse(value);
        else this.state.serviceArea[index][name] = value;
    }

    addServiceArea = () =>
        this.setState({
            serviceArea: [...this.state.serviceArea, {} as ServiceArea]
        });

    deleteServiceArea(index: number) {
        const { serviceArea } = this.state;

        serviceArea.splice(index, 1);

        this.setState({ serviceArea });
    }

    handleSubmit = async (event: Event) => {
        event.preventDefault();

        const { serviceArea, contacts, ...data } = this.state;

        await logistics.update(
            {
                ...data,
                serviceArea: serviceArea.filter(({ city }) => city?.trim()),
                contacts: contacts.filter(
                    ({ name, phone }) => name?.trim() && phone?.trim()
                )
            },
            this.dataId
        );

        self.alert('提交成功，工作人员审核后即可查看');

        history.push(RouteRoot.Logistics);
    };

    render(_, { name, url, serviceArea, remark, contacts }: Logistics) {
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
                    />
                    <FormField label="寄送区域与其他能力">
                        {serviceArea.map(
                            (
                                { city, direction, personal }: ServiceArea,
                                index
                            ) => (
                                <InputGroup
                                    className="my-1"
                                    onChange={(event: Event) =>
                                        this.changeServiceArea(index, event)
                                    }
                                >
                                    <Field
                                        name="city"
                                        value={city}
                                        placeholder="请输入寄送城市"
                                    />
                                    <Field
                                        is="select"
                                        name="direction"
                                        value={direction}
                                    >
                                        <option selected>选择寄送方向</option>
                                        <option value="in">只能寄入</option>
                                        <option value="out">只能寄出</option>
                                        <option value="both">寄入寄出</option>
                                    </Field>
                                    <Field is="select" name="personal">
                                        <option selected>
                                            是否接受个人捐赠
                                        </option>
                                        <option
                                            value="true"
                                            selected={personal}
                                        >
                                            是
                                        </option>
                                        <option
                                            value="false"
                                            selected={!personal}
                                        >
                                            否
                                        </option>
                                    </Field>

                                    <Button
                                        color="primary"
                                        onClick={this.addServiceArea}
                                    >
                                        +
                                    </Button>
                                    <Button
                                        color="danger"
                                        disabled={!serviceArea[1]}
                                        onClick={() =>
                                            this.deleteServiceArea(index)
                                        }
                                    >
                                        -
                                    </Button>
                                </InputGroup>
                            )
                        )}
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
                        defaultValue={remark}
                        label="备注"
                    />
                    <div className="form-group mt-3">
                        <Button
                            type="submit"
                            color="primary"
                            block
                            disabled={logistics.loading}
                        >
                            提交
                        </Button>
                        <Button
                            type="reset"
                            color="danger"
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
