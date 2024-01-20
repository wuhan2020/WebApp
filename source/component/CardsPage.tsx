import * as clipboard from 'clipboard-polyfill';
import { mixin, VNodeChildElement, createCell, Fragment } from 'web-cell';

import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Button } from 'boot-cell/source/Form/Button';
import { ToggleField } from 'boot-cell/source/Form/ToggleField';
import 'boot-cell/source/Content/EdgeDetector';
import { EdgeEvent } from 'boot-cell/source/Content/EdgeDetector';

import { DistrictEvent, DistrictFilter, District } from './DistrictFilter';
import { VerifiableModel, session } from '../model';

export abstract class CardsPage<T> extends mixin() {
    abstract scope: string;
    abstract model: VerifiableModel;
    abstract name: string;
    districtFilter = false;

    filter: District & { verified?: boolean } = {
        verified: !session.hasRole('Admin')
    };

    loadMore = ({ detail }: EdgeEvent) => {
        if (detail === 'bottom') return this.model.getNextPage(this.filter);
    };

    changeDistrict = ({ detail }: DistrictEvent) =>
        this.model.getNextPage(
            (this.filter = { ...detail, verified: this.filter.verified }),
            true
        );

    changeVerified = ({ target }: Event) => {
        const { checked } = target as HTMLInputElement;

        this.filter.verified = checked;

        return this.model.getNextPage(this.filter, true);
    };

    async clip2board(raw: string) {
        await clipboard.writeText(raw);

        self.alert('已复制到剪贴板');
    }

    abstract renderItem(data: T): VNodeChildElement;

    render() {
        const { name: title, scope, districtFilter } = this,
            { loading, list, noMore } = this.model,
            admin = session.hasRole('Admin');

        return (
            <>
                <header className="d-flex justify-content-between align-items-center my-3">
                    <h2 className="m-0">{title}</h2>
                    <span>
                        <Button color="warning" href={scope + '/edit'}>
                            发布
                        </Button>
                    </span>
                </header>
                <div className="d-flex justify-content-between">
                    {!districtFilter ? null : (
                        <DistrictFilter onChange={this.changeDistrict} />
                    )}
                    {!admin ? null : (
                        <ToggleField
                            type="checkbox"
                            switch
                            onClick={this.changeVerified}
                        >
                            审核
                        </ToggleField>
                    )}
                </div>
                <edge-detector onTouchEdge={this.loadMore}>
                    <SpinnerBox
                        cover={loading}
                        className="card-deck justify-content-around"
                    >
                        {list.map(this.renderItem)}
                    </SpinnerBox>
                    <p slot="bottom" className="text-center mt-2">
                        {noMore ? '没有更多数据了' : '加载更多...'}
                    </p>
                </edge-detector>
            </>
        );
    }
}
