import { WebCellProps, component, mixin, watch, createCell } from 'web-cell';
import { FieldProps, Field } from 'boot-cell/source/Form/Field';
import { FormField } from 'boot-cell/source/Form/FormField';
import { InputGroup } from 'boot-cell/source/Form/InputGroup';
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
                    <InputGroup
                        className="my-1"
                        onChange={(event: Event) =>
                            this.changeItem(index, event)
                        }
                    >
                        <Field name="name" value={name} placeholder="姓名" />
                        <Field
                            type="tel"
                            name="phone"
                            value={phone}
                            placeholder="电话号码（含国家码、区号）"
                        />

                        <Button color="primary" onClick={this.addItem}>
                            +
                        </Button>
                        <Button
                            color="danger"
                            disabled={!list[1]}
                            onClick={() => this.deleteItem(index)}
                        >
                            -
                        </Button>
                    </InputGroup>
                ))}
            </FormField>
        );
    }
}
