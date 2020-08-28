import { component, createCell, Fragment } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { Card } from 'boot-cell/source/Content/Card';
import { BGIcon } from 'boot-cell/source/Reminder/FAIcon';

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
            footer={<AuditBar scope="logistics" model={logistics} {...rest} />}
        >
            {serviceArea.map(this.renderServiceArea)}

            {contacts[0] && contacts.map(this.renderContact)}

            <p className="text-muted">{remark}</p>
        </Card>
    );

    renderServiceArea = ({ city, direction, personal }: ServiceArea) => (
        <>
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
        </>
    );

    renderContact = ({ name, phone }: Contact) => (
        <p className="mb-1">
            <a
                className="text-center text-decoration-none"
                href={'tel:' + phone}
            >
                <BGIcon type="square" name="phone" color="primary" />
                {` ${name} ${phone}`}
            </a>
        </p>
    );
}
