import { component, observer } from 'web-cell';
import { Badge, Card, CardBody, CardFooter, CardTitle } from 'boot-cell';
import { BGIcon } from '../../component/BGIcon';

import { AuditBar } from '../../component/AuditBar';
import { CardsPage } from '../../component/CardsPage';
import { logistics, Logistics, ServiceArea } from '../../model';
import { Contact } from '../../service';

const DIREACTION = {
    in: '寄入',
    out: '寄出',
    both: '寄入寄出'
};

@component({ tagName: 'logistics-page' })
@observer
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
        >
            <CardBody>
                <CardTitle>
                    {url ? (
                        <a target="_blank" href={url}>
                            {name}
                        </a>
                    ) : (
                        name
                    )}
                </CardTitle>

                {serviceArea.map(this.renderServiceArea)}

                {contacts?.map(this.renderContact)}

                <p className="text-muted">{remark}</p>
            </CardBody>
            <CardFooter>
                <AuditBar scope="logistics" model={logistics} {...rest} />
            </CardFooter>
        </Card>
    );

    renderServiceArea = ({ city, direction, personal }: ServiceArea) => (
        <dl>
            <dt>地区：</dt>
            <dd>{city}</dd>
            <dt>方向：</dt>
            <dd>{DIREACTION[direction]}</dd>
            {!personal && (
                <dd>
                    <Badge bg="danger">不接受个人捐赠</Badge>
                </dd>
            )}
        </dl>
    );

    renderContact = ({ name, phone }: Contact) => (
        <p className="mb-1">
            <a
                className="text-center text-decoration-none"
                href={'tel:' + phone}
            >
                <BGIcon name="phone" /> {name} {phone}
            </a>
        </p>
    );
}
