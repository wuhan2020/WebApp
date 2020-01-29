// import * as clipboard from 'clipboard-polyfill';
import { component, mixin, createCell, Fragment } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Card } from 'boot-cell/source/Content/Card';
// import { Button } from 'boot-cell/source/Form/Button';
// import { DropMenu } from 'boot-cell/source/Navigator/DropMenu';
import 'boot-cell/source/Content/EdgeDetector';
import { EdgeEvent } from 'boot-cell/source/Content/EdgeDetector';
import { freeClinic } from '../../model';

interface ClinicPageState {
    loading?: boolean;
    noMore?: boolean;
}

@observer
@component({
    tagName: 'clinic-page',
    renderTarget: 'children'
})
export class ClinicPage extends mixin<{}, ClinicPageState>() {
    state = { loading: false, noMore: false };

    loadMore = async ({ detail }: EdgeEvent) => {
        if (detail !== 'bottom' || this.state.noMore) return;
        await this.setState({ loading: true });
        const data = await freeClinic.getNextPage();
        await this.setState({ loading: false, noMore: !data });
    };

    renderItem = ({ name, url, notes, phones }: any) => {
        return (
            <Card
                className="mx-auto mb-4 mx-sm-1"
                style={{ minWidth: '20rem', maxWidth: '20rem' }}
                title={name}
            >
                <div>联系方式: {phones}</div>
                <p>
                    官方链接: <a href={url}>{url}</a>
                </p>
                <p>备注{notes}</p>
            </Card>
        );
    };

    render(_, { loading, noMore }: ClinicPageState) {
        return (
            <SpinnerBox cover={loading}>
                <header className="d-flex justify-content-between align-item-center my-3">
                    <h2>义诊单位或个人</h2>
                    {/* <span>
                        <Button kind="warning" href="hospital/edit">
                            需求发布
                        </Button>
                    </span> */}
                </header>

                <edge-detector onTouchEdge={this.loadMore}>
                    <div className="card-deck justify-content-around">
                        {freeClinic.list.map(this.renderItem)}
                    </div>
                    <p slot="bottom" className="text-center mt-2">
                        {noMore ? '没有更多数据了' : '加载更多...'}
                    </p>
                </edge-detector>
            </SpinnerBox>
        );
    }
}
