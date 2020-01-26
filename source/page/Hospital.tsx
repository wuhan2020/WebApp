import * as clipboard from 'clipboard-polyfill';
import { component, mixin, createCell } from 'web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Card } from 'boot-cell/source/Content/Card';
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

    async clip2board(raw: string) {
        await clipboard.writeText(raw);

        self.alert('已复制到剪贴板');
    }

    renderItem = ({ url, name, supplies = [], address, contact }: Hospital) => (
        <Card
            className="mb-4"
            style={{ minWidth: '20rem' }}
            title={
                url ? (
                    <a target="_blank" href={url}>
                        {name}
                    </a>
                ) : (
                    name
                )
            }
        >
            <ol>
                {supplies.map(item => (
                    <li>{item}</li>
                ))}
            </ol>

            <Button block onClick={() => this.clip2board(address)}>
                邮寄地址
            </Button>

            {contact?.map(({ name, numbers }) =>
                numbers.map(item => (
                    <Button block href={'tel:+86-' + item}>
                        {name}：+86-{item}
                    </Button>
                ))
            )}
        </Card>
    );

    render(_, { loading, list }: HospitalPageState) {
        return (
            <SpinnerBox cover={loading}>
                <h2>医院急需物资</h2>

                <div className="card-deck">{list.map(this.renderItem)}</div>
            </SpinnerBox>
        );
    }
}
