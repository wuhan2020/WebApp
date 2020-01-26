import * as clipboard from 'clipboard-polyfill';
import { component, mixin, createCell, Fragment } from 'web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Table } from 'boot-cell/source/Content/Table';
import { Button } from 'boot-cell/source/Form/Button';
import { parse } from 'yaml';

import { repository } from '../model';

interface Contact {
    name: string;
    numbers: string[];
}

interface Hospital {
    name: string;
    url: string;
    address: string;
    size: number;
    supplies: string[];
    contact?: Contact[];
    remark: string;
}

interface HospitalPageState {
    loading?: boolean;
    list?: Hospital[];
}

@component({
    tagName: 'hospital-page',
    renderTarget: 'children'
})
export class HospitalPage extends mixin<{}, HospitalPageState>() {
    state = { loading: true, list: [] };

    async connectedCallback() {
        super.connectedCallback();

        const data = await repository.getContents('data/Hospital.yml');

        await this.setState({ loading: false, list: parse(data) });
    }

    renderItem({
        name,
        url,
        address,
        supplies = [],
        contact,
        remark
    }: Hospital) {
        return (
            <tr>
                <td className="text-nowrap">
                    {url ? (
                        <a target="_blank" href={url}>
                            {name}
                        </a>
                    ) : (
                        name
                    )}
                </td>
                <td>
                    <Button onClick={() => clipboard.writeText(address)}>
                        复制
                    </Button>
                </td>
                <td className="text-left">
                    <ol>
                        {supplies.map(item => (
                            <li>{item}</li>
                        ))}
                    </ol>
                </td>
                <td className="text-nowrap">
                    {contact && (
                        <ul className="list-unstyled">
                            {(contact as Contact[]).map(({ name, numbers }) => (
                                <li>
                                    {name}：
                                    {numbers.map((item, index) => (
                                        <a
                                            className="mx-1"
                                            href={'tel:+86-' + item}
                                        >
                                            电话
                                            {++index}
                                        </a>
                                    ))}
                                </li>
                            ))}
                        </ul>
                    )}
                </td>
                <td>{remark}</td>
            </tr>
        );
    }

    render(_, { loading, list }: HospitalPageState) {
        return (
            <SpinnerBox cover={loading}>
                <h2>医院急需物资</h2>

                <Table center striped hover>
                    <thead>
                        <tr>
                            <th>名称</th>
                            <th>地址</th>
                            <th>急需物资</th>
                            <th>联系方式</th>
                            <th>备注</th>
                        </tr>
                    </thead>
                    <tbody>{list.map(this.renderItem)}</tbody>
                </Table>
            </SpinnerBox>
        );
    }
}
