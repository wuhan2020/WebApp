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
import { Logistics, logistics, ServiceArea } from '../../model';
import { SessionBox } from '../../component/SessionBox';
import { ContactField } from '../../component/ContactField';

const initServiceArea: ServiceArea = {
    city: '',
    direction: 'in',
    personal: false
};

export interface LogisticsEditProps {
    dataId: string;
}

export interface LogisticsEdit extends WebCell<LogisticsEditProps> {}

@component({ tagName: 'logistics-edit' })
@observer
export class LogisticsEdit
    extends HTMLElement
    implements WebCell<LogisticsEditProps>
{
    @attribute
    @observable
    accessor dataId = '';

    @observable
    accessor state = {
        name: '',
        url: '',
        serviceArea: [initServiceArea],
        remark: '',
        contacts: [{ name: '', phone: '' }]
    } as Logistics;

    async connectedCallback() {
        if (!this.dataId) return;

        const { name, url, serviceArea, remark, contacts } =
            await logistics.getOne(this.dataId);

        this.state = { name, url, serviceArea, remark, contacts };
    }

    changeText = ({ target }: Event) => {
        const { name, value } = target as HTMLInputElement;

        this.state = { ...this.state, [name]: value };
    };

    changeServiceArea(index: number, event: Event) {
        event.stopPropagation();

        const { name, value } = event.target as HTMLInputElement;

        if (name === 'personal')
            this.state.serviceArea[index].personal = JSON.parse(value);
        else this.state.serviceArea[index][name] = value;
    }

    addServiceArea = () =>
        (this.state = {
            ...this.state,
            serviceArea: [...this.state.serviceArea, {} as ServiceArea]
        });

    deleteServiceArea(index: number) {
        const { serviceArea } = this.state;

        this.state.serviceArea = [
            ...serviceArea.slice(0, index),
            ...serviceArea.slice(index + 1)
        ];
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

        location.hash = RouteRoot.Logistics;
    };

    render() {
        const { name, url, serviceArea, remark, contacts } = this.state;

        return (
            <SessionBox>
                <h2>物流信息发布</h2>
                {/* @ts-ignore */}
                <form onChange={this.changeText} onSubmit={this.handleSubmit}>
                    <FormField
                        as="input"
                        name="name"
                        required
                        defaultValue={name}
                        label="物流公司名称"
                        placeholder="请填写物流公司名称"
                    />
                    <FormField
                        as="input"
                        name="url"
                        required
                        defaultValue={url}
                        label="来源链接"
                        placeholder="请填写物流来源的链接地址"
                    />
                    <FormGroup>
                        <FormLabel>寄送区域与其他能力</FormLabel>

                        {serviceArea.map(
                            ({ city, direction, personal }, index) => (
                                <InputGroup
                                    className="my-1"
                                    onChange={(event: Event) =>
                                        this.changeServiceArea(index, event)
                                    }
                                >
                                    <FormControl
                                        as="input"
                                        name="city"
                                        value={city}
                                        placeholder="请输入寄送城市"
                                    />
                                    <FormControl
                                        as="select"
                                        name="direction"
                                        value={direction}
                                    >
                                        <option selected>选择寄送方向</option>
                                        <option value="in">只能寄入</option>
                                        <option value="out">只能寄出</option>
                                        <option value="both">寄入寄出</option>
                                    </FormControl>
                                    <FormControl as="select" name="personal">
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
                                    </FormControl>

                                    <Button
                                        variant="primary"
                                        onClick={this.addServiceArea}
                                    >
                                        +
                                    </Button>
                                    <Button
                                        variant="danger"
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
                        defaultValue={remark}
                        label="备注"
                    />
                    <div className="form-group mt-3 d-flex flex-column">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={logistics.loading}
                        >
                            提交
                        </Button>
                        <Button
                            type="reset"
                            variant="danger"
                            onClick={() =>
                                (location.hash = RouteRoot.Logistics)
                            }
                        >
                            取消
                        </Button>
                    </div>
                </form>
            </SessionBox>
        );
    }
}
