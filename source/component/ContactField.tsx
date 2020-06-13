import { WebCellProps, component, mixin, createCell, watch } from 'web-cell';
import { FieldProps } from 'boot-cell/source/Form/Field';
import { FormField } from 'boot-cell/source/Form/FormField';
import { Button } from 'boot-cell/source/Form/Button';

import { Contact } from '../service';

interface ContactFieldProps extends FieldProps, WebCellProps {
    list: Contact[];
}

@component({
    tagName: 'contact-field',
    renderTarget: 'children'
})
export class ContactField extends mixin<ContactFieldProps>() {
    @watch
    list = [];

    private emitChange() {
        this.emit('change', this.list);
    }

    changeItem(index: number, event: Event) {
        event.stopPropagation();

        const { name, value } = event.target as HTMLInputElement;

        this.list[index][name] = value;

        this.emitChange();
    }

    addItem = async () => {
        await this.setProps({ list: this.list.concat({}) });

        this.emitChange();
    };

    async deleteItem(index: number) {
        const { list } = this;

        list.splice(index, 1);

        await this.setProps({ list });

        this.emitChange();
    }

    render({ list }: ContactFieldProps) {
        return (
            <FormField label="联系方式">
                {list.map(({ name, phone }, index) => (
                    <div
                        className="input-group my-1"
                        onChange={(event: Event) =>
                            this.changeItem(index, event)
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
                            placeholder="电话号码（含国家码、区号）"
                        />
                        <div className="input-group-append">
                            <Button onClick={this.addItem}>+</Button>
                            <Button
                                kind="danger"
                                disabled={!list[1]}
                                onClick={() => this.deleteItem(index)}
                            >
                                -
                            </Button>
                        </div>
                    </div>
                ))}
            </FormField>
        );
    }
}
