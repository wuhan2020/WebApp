import { component, mixin, watch, createCell } from 'web-cell';
import { FormField } from 'boot-cell/source/Form/FormField';
import { Button } from 'boot-cell/source/Form/Button';

import { Supplies } from '../model';

interface SuppliesFieldProps {
    list: Supplies[];
}

@component({
    tagName: 'supplies-field',
    renderTarget: 'children'
})
export class SuppliesField extends mixin<SuppliesFieldProps>() {
    @watch
    list = [];

    private emitChange() {
        this.emit('change', this.list);
    }

    changeItem(index: number, event: Event) {
        event.stopPropagation();

        const { name, value } = event.target as HTMLInputElement;

        this.list[index][name] = isNaN(+value) ? value : +value;

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

    render({ list }: SuppliesFieldProps) {
        return (
            <FormField label="物资列表">
                {list.map(({ name, count, remark }, index) => (
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
                            placeholder="名称"
                        />
                        <input
                            type="number"
                            className="form-control"
                            name="count"
                            min="0"
                            value={count}
                            placeholder="数量"
                        />
                        <input
                            type="text"
                            className="form-control"
                            name="remark"
                            value={remark}
                            placeholder="备注"
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
