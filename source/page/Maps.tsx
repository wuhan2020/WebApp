import { component, createCell, mixin } from 'web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Table } from 'boot-cell/source/Content/Table';

interface Map {
    name: string;
    url: string;
}

interface MapPageState {
    loading?: boolean;
    list?: Map[];
}

@component({
    tagName: 'maps-page',
    renderTarget: 'children'
})
export class MapsPage extends mixin<{}, ClinicPageState>() {
    state = { loading: true, list: [] };

    async connectedCallback() {
        super.connectedCallback();

        // Here are the data where I find form issue #56, if the api-server has the data, plz change
        const list: Map[] = [
            {
                name: '丁香园',
                url: 'https://ncov.dxy.cn/ncovh5/view/pneumonia'
            },
            {
                name: '腾讯',
                url: 'https://news.qq.com/zt2020/page/feiyan.htm'
            },
            {
                name: '百度',
                url: 'https://voice.baidu.com/act/newpneumonia/newpneumonia'
            },
            {
                name: '微脉',
                url: 'https://m.myweimai.com/topic/epidemic_info.html'
            },
        ];

        await this.setState({ loading: false, list });
    }

    render(_, { loading, list }: MapPageState) {
        return (
            <SpinnerBox cover={loading}>
                <header className="d-flex justify-content-between align-item-center my-3">
                    <h2>疫情地图</h2>
                </header>

                <Table center striped hover>
                    <thead>
                        <tr>
                            <th>地图来源</th>
                            <th>地图链接</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map(({ name, url }: Map) => (
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
                                <td className="text-nowrap">{url}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </SpinnerBox>
        );
    }
}
