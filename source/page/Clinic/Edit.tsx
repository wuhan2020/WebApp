import { component, mixin, watch, createCell } from 'web-cell';
import { FormField } from 'boot-cell/source/Form/FormField';
import { Button } from 'boot-cell/source/Form/Button';

import { Clinic, history, clinic } from '../../model';
import { RouteRoot } from '../data/menu';
import { SessionBox, ContactField } from '../../component';

interface ClinicEditProps {
    dataId?: string;
}

@component({
    tagName: 'clinic-edit',
    renderTarget: 'children'
})
export class ClinicEdit extends mixin<ClinicEditProps, Clinic>() {
    @watch
    dataId = '';

    state = {
        name: '',
        url: '',
        startTime: '09:00',
        endTime: '18:00',
        contacts: [{ name: '', phone: '' }],
        remark: ''
    };

    async connectedCallback() {
        super.connectedCallback();

        if (!this.dataId) return;

        const {
            name,
            url,
            contacts,
            startTime,
            endTime,
            remark
        } = await clinic.getOne(this.dataId);

        await this.setState({
            name,
            url,
            contacts,
            startTime,
            endTime,
            remark
        });
    }

    changeText = ({ target }: Event) => {
        const { name, value } = target as HTMLInputElement;

        this.state[name] = value;
    };

    handleSubmit = async (event: Event) => {
        event.preventDefault();

        const { contacts, ...rest } = this.state;

        await clinic.update(
            {
                ...rest,
                contacts: contacts.filter(({ name }) => name.trim())
            },
            this.dataId
        );

        self.alert('发布成功！');

        history.push(RouteRoot.Clinic);
    };

    render(
        { dataId }: ClinicEditProps,
        { name, url, startTime, endTime, contacts, remark }: Clinic
    ) {
        return (
            <SessionBox>
                <h2>义诊服务{dataId ? '发布' : '修改'}</h2>

                <form onChange={this.changeText} onSubmit={this.handleSubmit}>
                    <FormField
                        name="name"
                        required
                        defaultValue={name}
                        label="机构/个人名"
                    />
                    <FormField
                        type="url"
                        name="url"
                        required
                        defaultValue={url}
                        label="官方网址"
                        placeholder="官网 或 信息来源"
                    />

                    <FormField label="每日接诊起止时间">
                        <div className="input-group">
                            <input
                                type="time"
                                className="form-control"
                                name="startTime"
                                required
                                defaultValue={startTime}
                                placeholder="开始"
                            />
                            <input
                                type="time"
                                className="form-control"
                                name="endTime"
                                required
                                defaultValue={endTime}
                                placeholder="结束"
                            />
                        </div>
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
                        <Button type="submit" block disabled={clinic.loading}>
                            提交
                        </Button>
                        <Button
                            type="reset"
                            kind="danger"
                            block
                            onClick={() => history.push(RouteRoot.Clinic)}
                        >
                            取消
                        </Button>
                    </div>
                </form>
            </SessionBox>
        );
    }
}
