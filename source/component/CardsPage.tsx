import { VerificationBase } from '@wuhan2020/rest-api';
import { Button, FormCheck, ScrollBoundary, SpinnerBox, TouchHandler } from 'boot-cell';
import { JsxChildren } from 'dom-renderer';
import { Filter } from 'mobx-restful';
import { CustomElement } from 'web-utility';

import { session, VerifiableModel } from '../model';
import { District, DistrictEvent, DistrictFilter } from './DistrictFilter';

export abstract class CardsPage<T extends VerificationBase>
    extends HTMLElement
    implements CustomElement
{
    abstract scope: string;
    abstract model: VerifiableModel<T>;
    abstract name: string;
    districtFilter = false;

    filter = {
        verified: !session.hasRole('Admin')
    } as Filter<T> & District & { verified?: boolean };

    disconnectedCallback() {
        this.model.clear();
    }

    loadMore: TouchHandler = detail => {
        if (detail === 'bottom') return this.model.getList(this.filter);
    };

    changeDistrict = ({ detail }: DistrictEvent) =>
        this.model.getList((this.filter = { ...this.filter, ...detail }), 1);

    changeVerified = ({ target }: Event) => {
        const { checked } = target as HTMLInputElement;

        this.filter.verified = checked;

        return this.model.getList(this.filter, 1);
    };

    async clip2board(raw: string) {
        await navigator.clipboard.writeText(raw);

        self.alert('已复制到剪贴板');
    }

    abstract renderItem(data: T): JsxChildren;

    render() {
        const { name: title, scope, districtFilter } = this,
            { downloading, allItems, noMore } = this.model,
            admin = session.hasRole('Admin');

        return (
            <>
                <header className="d-flex justify-content-between align-items-center my-3">
                    <h2 className="m-0">{title}</h2>
                    <span>
                        <Button variant="warning" href={`#${scope}/edit`}>
                            发布
                        </Button>
                    </span>
                </header>
                <div className="d-flex justify-content-between">
                    {districtFilter && <DistrictFilter onChange={this.changeDistrict} />}
                    {admin && (
                        <FormCheck type="switch" onClick={this.changeVerified}>
                            审核
                        </FormCheck>
                    )}
                </div>
                <ScrollBoundary onTouch={this.loadMore}>
                    <SpinnerBox
                        cover={downloading > 0}
                        className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3"
                    >
                        {allItems.map(item => (
                            <div key={item.id} className="col">
                                {this.renderItem(item as T)}
                            </div>
                        ))}
                    </SpinnerBox>
                    <p className="text-center mt-2">{noMore ? '没有更多数据了' : '加载更多...'}</p>
                </ScrollBoundary>
            </>
        );
    }
}
