import { Clinic } from '@wuhan2020/rest-api';
import { Button, FormControl, FormField, FormGroup, FormLabel, InputGroup } from 'boot-cell';
import { observable } from 'mobx';
import { attribute, component, observer, WebCell } from 'web-cell';

import { ContactField } from '../../component/ContactField';
import { SessionBox } from '../../component/SessionBox';
import { clinic } from '../../model';
import { RouteRoot } from '../data/menu';

export interface ClinicEditProps {
    dataId?: string;
}

export default interface ClinicEdit extends WebCell<ClinicEditProps> {}

@component({ tagName: 'clinic-edit' })
@observer
export default class ClinicEdit extends HTMLElement implements WebCell<ClinicEditProps> {
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
    } as Partial<Clinic>;

    async mountedCallback() {
        if (!this.dataId) return;

        const { name, url, contacts, startTime, endTime, remark } = await clinic.getOne(
            this.dataId
        );

        this.state = { name, url, contacts, startTime, endTime, remark };
    }

    changeText = ({ target }: Event) => {
        const { name, value } = target as HTMLInputElement;

        this.state = { ...this.state, [name]: value };
    };

    handleSubmit = async (event: Event) => {
        event.preventDefault();

        const { contacts, ...data } = this.state;

        await clinic.updateOne(
            {
                ...data,
                contacts: contacts.filter(({ name, phone }) => name?.trim() && phone?.trim())
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

                <form onChange={this.changeText} onSubmit={this.handleSubmit}>
                    <FormField name="name" required defaultValue={name} label="机构/个人名" />
                    <FormField
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
                                type="time"
                                name="startTime"
                                required
                                defaultValue={startTime}
                                placeholder="开始"
                            />
                            <FormControl
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
                        onChange={({ detail }: CustomEvent) => (this.state.contacts = detail)}
                    />
                    <FormField as="textarea" name="remark" defaultValue={remark} label="备注" />
                    <FormGroup className="mt-3 d-flex flex-column flex-sm-row">
                        <Button type="submit" variant="primary" disabled={clinic.uploading > 0}>
                            提交
                        </Button>
                        <Button
                            type="reset"
                            variant="danger"
                            onClick={() => (location.hash = RouteRoot.Clinic)}
                        >
                            取消
                        </Button>
                    </FormGroup>
                </form>
            </SessionBox>
        );
    }
}
