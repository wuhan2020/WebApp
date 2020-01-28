import * as clipboard from 'clipboard-polyfill';
import { component, mixin, createCell } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Card } from 'boot-cell/source/Content/Card';
import { Button } from 'boot-cell/source/Form/Button';
import { DropMenu } from 'boot-cell/source/Navigator/DropMenu';
import 'boot-cell/source/Content/EdgeDetector';
import { EdgeEvent } from 'boot-cell/source/Content/EdgeDetector';
import { hotelCanStaying } from '../../model';

interface HotelPageState {
    loading?: boolean;
    noMore?: boolean;
}

@observer
@component({
    tagName: 'hotel-page',
    renderTarget: 'children'
})
export class HotelPage extends mixin<{}, HotelPageState>() {
    state = {
        loading: false,
        noMore: false
    };

    loadMore = async ({ detail }: EdgeEvent) => {
        if (detail !== 'bottom' || this.state.noMore) return;
        await this.setState({ loading: true });
        const data = await hotelCanStaying.getNextPage();
        await this.setState({ loading: false, noMore: !data });
    };

    async clip2board(raw: string) {
        await clipboard.writeText(raw);
        self.alert('已复制到剪贴板');
    }

    renderItem = ({ name, address, capacity, contacts }: any) => {
        return (
            <Card
                className="mx-auto mb-4 mx-sm-1"
                style={{ minWidth: '20rem', maxWidth: '20rem' }}
                title={name}
            >
                <div>详细地址：{address}</div>
                <p>可接待人数：{capacity}</p>
                <div className="text-center">
                    <Button onClick={() => this.clip2board(address)}>
                        复制地址
                    </Button>
                    {contacts && (
                        <DropMenu
                            className="d-inline-block ml-3"
                            alignType="right"
                            title="联系方式"
                            list={contacts.map(({ name, number }) => ({
                                title: `${name}：+86-${number}`,
                                href: 'tel:+86-' + number
                            }))}
                        />
                    )}
                </div>
            </Card>
        );
    };

    render(_, { loading, noMore }: HotelPageState) {
        return (
            <SpinnerBox cover={loading}>
                <header className="d-flex justify-content-between align-item-center my-3">
                    <h2>湖北籍同胞全国住宿指南</h2>
                    <span>
                        <Button kind="warning" href="hotel/edit">
                            发布住宿信息
                        </Button>
                    </span>
                </header>
                <edge-detector onTouchEdge={this.loadMore}>
                    <div className="card-deck justify-content-around">
                        {hotelCanStaying.list.map(this.renderItem)}
                    </div>
                    <p slot="bottom" className="text-center mt-2">
                        {noMore ? '没有更多数据了' : '加载更多...'}
                    </p>
                </edge-detector>
            </SpinnerBox>
        );
    }
}
