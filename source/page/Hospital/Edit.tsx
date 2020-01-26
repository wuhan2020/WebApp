import { component, mixin, createCell, Fragment } from 'web-cell';
import { FormField } from 'boot-cell/source/Form/FormField';
import { Button } from 'boot-cell/source/Form/Button';

import { history } from '../../model';

interface Contact {
    name: string;
    number: string;
}

interface HospitalEditState {
    hospital?: string;
    address?: string;
    supplies?: string[];
    contacts?: Contact[];
}

@component({
    tagName: 'hospital-edit',
    renderTarget: 'children'
})
export class HospitalEdit extends mixin<{}, HospitalEditState>() {
    state = {
        hospital: '',
        address: '',
        supplies: [''],
        contacts: [{ name: '', number: '' }]
    };

    changeText = ({ target }: Event) => {
        const { name, value } = target as HTMLInputElement;

        this.state[name] = value;
    };

    changeSupply(index: number, event: Event) {
        const { value } = event.target as HTMLInputElement;

        this.state.supplies[index] = value;
    }

    addSupply = () => this.setState({ supplies: [...this.state.supplies, ''] });

    deleteSupply(index: number) {
        const { supplies } = this.state;

        supplies.splice(index, 1);

        this.setState({ supplies });
    }

    changeContact(index: number, event: Event) {
        const { name, value } = event.target as HTMLInputElement;

        this.state.contacts[index][name] = value;
    }

    addContact = () =>
        this.setState({
            contacts: [...this.state.contacts, { name: '', number: '' }]
        });

    deleteContact(index: number) {
        const { contacts } = this.state;

        contacts.splice(index, 1);

        this.setState({ contacts });
    }

    handleSubmit = (event: Event) => {
        event.preventDefault();

        console.log(this.state);
    };

    render(_, { hospital, address, supplies, contacts }: HospitalEditState) {
        return (
            <Fragment>
                <h2>医用物资需求发布</h2>

                <form onSubmit={this.handleSubmit}>
                    <FormField
                        name="hospital"
                        required
                        defaultValue={hospital}
                        label="医疗机构"
                        placeholder="可详细至分院、院区、科室"
                        onChange={this.changeText}
                    />
                    <FormField
                        name="address"
                        readOnly
                        defaultValue={address}
                        label="机构地址"
                    />
                    <fieldset name="supplies">
                        <legend>物资列表</legend>

                        {supplies.map((item, index) => (
                            <div
                                className="input-group"
                                onChange={(event: Event) =>
                                    this.changeSupply(index, event)
                                }
                            >
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={item}
                                    placeholder="物资名称"
                                />
                                <div className="input-group-append">
                                    <Button onClick={this.addSupply}>+</Button>
                                    <Button
                                        kind="danger"
                                        disabled={supplies.length < 2}
                                        onClick={() => this.deleteSupply(index)}
                                    >
                                        -
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </fieldset>

                    <fieldset name="contact">
                        <legend>联系方式</legend>

                        {contacts.map(({ name, number }, index) => (
                            <div
                                className="input-group"
                                onChange={(event: Event) =>
                                    this.changeContact(index, event)
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
                                    name="number"
                                    value={number}
                                    placeholder="电话号码"
                                />
                                <div className="input-group-append">
                                    <Button onClick={this.addContact}>+</Button>
                                    <Button
                                        kind="danger"
                                        disabled={!contacts[1]}
                                        onClick={() =>
                                            this.deleteContact(index)
                                        }
                                    >
                                        -
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </fieldset>

                    <div className="form-group mt-3">
                        <Button type="submit" block>
                            提交
                        </Button>
                        <Button
                            type="reset"
                            kind="danger"
                            block
                            onClick={() => history.back()}
                        >
                            取消
                        </Button>
                    </div>
                </form>
            </Fragment>
        );
    }
}
