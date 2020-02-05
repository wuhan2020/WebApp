import { component, createCell, Fragment } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { Card } from 'boot-cell/source/Content/Card';

import { AuditBar, CardsPage } from '../../component';
import { logistics, Logistics, ServiceArea } from '../../model';
import { Contact } from '../../service';

const DIREACTION = {
    in: '寄入',
    out: '寄出',
    both: '寄入寄出'
};

@observer
@component({
    tagName: 'logistics-page',
    renderTarget: 'children'
})
export class LogisticsPage extends CardsPage<Logistics> {
    scope = 'logistics';
    model = logistics;
    name = '物流公司';

    renderItem = ({
        url,
        name,
        serviceArea,
        contacts,
        remark,
        ...rest
    }: Logistics) => (
        <Card
            className="mx-auto mb-4 mx-sm-1"
            style={{ minWidth: '20rem', maxWidth: '20rem' }}
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
            {serviceArea.map(this.renderServiceArea)}

            {contacts.map(this.renderContact)}

            <p className="text-muted">{remark}</p>

            <AuditBar scope="logistics" model={logistics} {...rest} />
        </Card>
    );

    renderServiceArea = ({ city, direction, personal }: ServiceArea) => (
        <Fragment>
            <p className="mb-1">
                <strong>地区：</strong>
                {city}
            </p>
            <p className="mb-1">
                <strong>方向：</strong>
                {DIREACTION[direction]}
            </p>
            {personal ? null : (
                <p className="mb-1">
                    <span className="badge badge-danger">不接受个人捐赠</span>
                </p>
            )}
        </Fragment>
    );

    renderContact = ({ name, phone }: Contact) => (
        <p className="mb-1">
            <a
                className="text-center text-decoration-none"
                href={'tel:' + phone}
            >
                <i
                    className="fa fa-phone btn btn-sm btn-primary"
                    aria-hidden="true"
                />
                &nbsp;
                {name}
                &nbsp;
                {phone}
            </a>
        </p>
    );
}
