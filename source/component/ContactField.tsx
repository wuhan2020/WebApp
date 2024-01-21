import { WebCell, component, observer, reaction } from 'web-cell';
import { observable } from 'mobx';
import {
    FormControl,
    FormControlProps,
    FormGroup,
    FormLabel,
    InputGroup,
    Button,
} from 'boot-cell';

import { Contact } from '../service';

export interface ContactFieldProps
    extends Omit<FormControlProps<'input'>, 'list'> {
    list: Contact[];
}

export interface ContactField extends WebCell<ContactFieldProps> {}

@component({ tagName: 'contact-field' })
@observer
export class ContactField
    extends HTMLElement
    implements WebCell<ContactFieldProps>
{
    @observable
    accessor list: Contact[] = [];

    @reaction(({ list }) => list)
    emitChange() {
        this.emit('change', this.list);
    }

    changeItem(index: number, event: Event) {
        event.stopPropagation();

        const { list } = this;
        const item = list[index],
            { name, value } = event.target as HTMLInputElement;

        this.list = [
            ...list.slice(0, index),
            { ...item, [name]: value },
            ...list.slice(index + 1)
        ];
    }

    addItem = () => (this.list = [...this.list, {} as Contact]);

    deleteItem(index: number) {
        const { list } = this;

        this.list = [...list.slice(0, index), ...list.slice(index + 1)];
    }

    render({ list }: ContactFieldProps) {
        return (
            <FormGroup>
                <FormLabel>联系方式</FormLabel>

                {list.map(({ name, phone }, index) => (
                    <InputGroup
                        className="my-1"
                        onChange={(event: Event) =>
                            this.changeItem(index, event)
                        }
                    >
                        <FormControl
                            as="input"
                            name="name"
                            value={name}
                            placeholder="姓名"
                        />
                        <FormControl
                            as="input"
                            type="tel"
                            name="phone"
                            value={phone}
                            placeholder="电话号码（含国家码、区号）"
                        />

                        <Button variant="primary" onClick={this.addItem}>
                            +
                        </Button>
                        <Button
                            variant="danger"
                            disabled={!list[1]}
                            onClick={() => this.deleteItem(index)}
                        >
                            -
                        </Button>
                    </InputGroup>
                ))}
            </FormGroup>
        );
    }
}
