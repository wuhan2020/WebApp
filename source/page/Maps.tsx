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
const isMobile = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
);

@component({
    tagName: 'maps-page',
    renderTarget: 'children'
})
export class MapsPage extends mixin<{}, MapPageState>() {
    state = { loading: true, list: [] };

    async connectedCallback() {
        super.connectedCallback();

        // Here are the data where I find form issue #56, if the api-server has the data, plz change
        // const list: Map[] = [
        //     {
        //         name: '丁香园',
        //         url: 'https://ncov.dxy.cn/ncovh5/view/pneumonia'
        //     },
        //     {
        //         name: '腾讯',
        //         url: 'https://news.qq.com/zt2020/page/feiyan.htm'
        //     },
        //     {
        //         name: '百度',
        //         url: 'https://voice.baidu.com/act/newpneumonia/newpneumonia'
        //     },
        //     {
        //         name: '微脉',
        //         url: 'https://m.myweimai.com/topic/epidemic_info.html'
        //     },
        // ];

        await this.setState({ loading: false });
    }

    render(_, { loading }: MapPageState) {
        const mapContainerStyle: any = {
            width: '100%'
        };
        if (isMobile) {
            mapContainerStyle.height = 'calc(100vh - 60px)';
        } else {
            mapContainerStyle.height = 'calc(100vh - 100px)';
        }
        return (
            <div style={mapContainerStyle}>
                <SpinnerBox cover={loading}>
                    <HierarchicalVirusMap
                        data={VirusData}
                        resolution={resolution}
                    />
                </SpinnerBox>
            </div>
        );
    }
}
