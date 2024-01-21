import { WebCell, attribute, component, observer } from 'web-cell';
import { observable } from 'mobx';
import {
    FormField,
    InputGroup,
    FormGroup,
    FormLabel,
    FormControl,
    Button,
} from 'boot-cell';

import { Clinic, clinic } from '../../model';
import { RouteRoot } from '../data/menu';
import { ContactField } from '../../component/ContactField';
import { SessionBox } from '../../component/SessionBox';

export interface ClinicEditProps {
    dataId?: string;
}

export interface ClinicEdit extends WebCell<ClinicEditProps> {}

@component({ tagName: 'clinic-edit' })
@observer
export class ClinicEdit
    extends HTMLElement
    implements WebCell<ClinicEditProps>
{
    @attribute
    @observable
    accessor dataId = '';

    @observable
    accessor state = {
        name: '',
        url: '',
        startTime: '09:00',
        endTime: '18:00',
        contacts: [{ name: '', phone: '' }],
        remark: ''
    } as Clinic;

    async connectedCallback() {
        if (!this.dataId) return;

        const { name, url, contacts, startTime, endTime, remark } =
            await clinic.getOne(this.dataId);

        this.state = { name, url, contacts, startTime, endTime, remark };
    }

    changeText = ({ target }: Event) => {
        const { name, value } = target as HTMLInputElement;

        this.state = { ...this.state, [name]: value };
    };

    handleSubmit = async (event: Event) => {
        event.preventDefault();

        const { contacts, ...data } = this.state;

        await clinic.update(
            {
                ...data,
                contacts: contacts.filter(
                    ({ name, phone }) => name?.trim() && phone?.trim()
                )
            },
            this.dataId
        );

        self.alert('提交成功，工作人员审核后即可查看');

        location.hash = RouteRoot.Clinic;
    };

    render() {
        const { dataId } = this,
            { name, url, startTime, endTime, contacts, remark } = this.state;

        return (
            <SessionBox>
                <h2>义诊服务{dataId ? '发布' : '修改'}</h2>
                {/* @ts-ignore */}
                <form onChange={this.changeText} onSubmit={this.handleSubmit}>
                    <FormField
                        as="input"
                        name="name"
                        required
                        defaultValue={name}
                        label="机构/个人名"
                    />
                    <FormField
                        as="input"
                        type="url"
                        name="url"
                        required
                        defaultValue={url}
                        label="官方网址"
                        placeholder="官网 或 信息来源"
                    />

                    <FormGroup>
                        <FormLabel>每日接诊起止时间</FormLabel>
                        <InputGroup>
                            <FormControl
                                as="input"
                                type="time"
                                name="startTime"
                                required
                                defaultValue={startTime}
                                placeholder="开始"
                            />
                            <FormControl
                                as="input"
                                type="time"
                                name="endTime"
                                required
                                defaultValue={endTime}
                                placeholder="结束"
                            />
                        </InputGroup>
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
                    <div className="form-group mt-3 d-flex flex-column flex-sm-row">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={clinic.loading}
                        >
                            提交
                        </Button>
                        <Button
                            type="reset"
                            variant="danger"
                            onClick={() => (location.hash = RouteRoot.Clinic)}
                        >
                            取消
                        </Button>
                    </div>
                </form>
            </SessionBox>
        );
    }
}
