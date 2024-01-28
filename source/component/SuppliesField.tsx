import { WebCell, component, observer, reaction } from 'web-cell';
import {
    FormControl,
    FormControlProps,
    FormField,
    FormLabel,
    InputGroup,
    Button
} from 'boot-cell';
import { observable } from 'mobx';

import { Supplies } from '../model';

export interface SuppliesFieldProps
    extends Omit<FormControlProps<'input'>, 'list'> {
    list: Supplies[];
}

export interface SuppliesField extends WebCell<SuppliesFieldProps> {}

@component({ tagName: 'supplies-field' })
@observer
export class SuppliesField
    extends HTMLElement
    implements WebCell<SuppliesFieldProps>
{
    @observable
    accessor list: Supplies[] = [];

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
            { ...item, [name]: isNaN(+value) ? value : +value },
            ...list.slice(index + 1)
        ];
    }

    addItem = () => (this.list = [...this.list, {} as Supplies]);

    deleteItem(index: number) {
        const { list } = this;

        this.list = [...list.slice(0, index), ...list.slice(index + 1)];
    }

    render() {
        const { list } = this;

        return (
            <FormField>
                <FormLabel>物资列表</FormLabel>

                {list.map(({ name, count, remark }, index) => (
                    <InputGroup
                        className="my-1"
                        onChange={(event: Event) =>
                            this.changeItem(index, event)
                        }
                    >
                        <FormControl
                            name="name"
                            value={name}
                            placeholder="名称"
                        />
                        <FormControl
                            type="number"
                            name="count"
                            min="0"
                            value={count + ''}
                            placeholder="数量"
                        />
                        <FormControl
                            name="remark"
                            value={remark}
                            placeholder="备注"
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
            </FormField>
        );
    }
}
