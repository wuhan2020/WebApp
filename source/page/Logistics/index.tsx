import { Logistics, ServiceArea } from '@wuhan2020/rest-api';
import { Contact } from '@wuhan2020/rest-api';
import { Badge, BGIcon, Card, CardBody, CardFooter, CardTitle } from 'boot-cell';
import { component, observer } from 'web-cell';

import { AuditBar } from '../../component/AuditBar';
import { CardsPage } from '../../component/CardsPage';
import { logistics } from '../../model';

const DIREACTION = {
    in: '寄入',
    out: '寄出',
    both: '寄入寄出'
};

@component({ tagName: 'logistics-page' })
@observer
export default class LogisticsPage extends CardsPage<Logistics> {
    scope = 'logistics';
    model = logistics;
    name = '物流公司';

    renderItem = ({ url, name, serviceArea, contacts, remark, ...rest }: Logistics) => (
        <Card key={name}>
            <CardBody>
                <CardTitle>
                    {url ? (
                        <a
                            className="text-decoration-none"
                            target="_blank"
                            href={url}
                            rel="noreferrer"
                        >
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
                <AuditBar scope="logistics" model={logistics} name={name} {...rest} />
            </CardFooter>
        </Card>
    );

    renderServiceArea = ({ city, direction, personal }: ServiceArea) => (
        <dl key={city}>
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
        <p key={name} className="mb-1">
            <a className="text-center text-decoration-none" href={'tel:' + phone}>
                <BGIcon name="phone" /> {name} {phone}
            </a>
        </p>
    );
}
