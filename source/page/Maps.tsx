// eslint-disable-next-line no-unused-vars
import { component, createCell, mixin } from 'web-cell';
// eslint-disable-next-line no-unused-vars
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
// eslint-disable-next-line no-unused-vars
import { VirusData, HierarchicalVirusMap } from 'wuhan2020-map-viz';

interface Map {
    name: string;
    url: string;
}

interface MapPageState {
    loading?: boolean;
    list?: Map[];
}

const resolution = 3600000 * 24;

@component({
    tagName: 'maps-page',
    renderTarget: 'children'
})
export class MapsPage extends mixin<{}, MapPageState>() {
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

    render(_, { loading }: MapPageState) {
        return (
            <div style={{ width: '100%', height: 'calc(100vh - 100px)' }}>
                <SpinnerBox cover={loading}>
                    <HierarchicalVirusMap
                        data={VirusData}
                        resolution={resolution}
                    />
                    {/* <Table center striped hover>
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
                    </Table> */}
                </SpinnerBox>
            </div>
        );
    }
}
