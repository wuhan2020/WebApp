import { Badge, BGIcon, Card, CardTitle } from 'boot-cell';
import { component, observer } from 'web-cell';

import { AuditBar } from '../../component/AuditBar';
import { CardsPage } from '../../component/CardsPage';
import { Clinic,clinic } from '../../model';
import { getIsLive } from './time';

@component({ tagName: 'clinic-list' })
@observer
export default class ClinicList extends CardsPage<Clinic> {
    scope = 'clinic';
    model = clinic;
    name = '义诊服务';

    renderItem = ({
        url,
        name,
        startTime,
        endTime,
        contacts,
        remark,
        ...rest
    }: Clinic) => (
        <Card key={name} body>
            <CardTitle>
                {url ? (
                    <a
                        className="text-decoration-none"
                        target="_blank"
                        href={url} rel="noreferrer"
                    >
                        {name}
                    </a>
                ) : (
                    name
                )}
            </CardTitle>

            {getIsLive(startTime, endTime) && (
                <Badge className="small" bg="info">
                    正在接诊
                </Badge>
            )}
            <p>
                每日接诊起止时间：{startTime} ~ {endTime}
            </p>
            {contacts[0] && (
                <ol className="list-unstyled">
                    {contacts.map(({ name, phone }) => (
                        <li key={name}>
                            <a
                                className="text-decoration-none"
                                href={'tel:' + phone}
                            >
                                <BGIcon name="phone" /> {name}：{phone}
                            </a>
                        </li>
                    ))}
                </ol>
            )}
            {remark && <p className="text-muted">{remark}</p>}

            <AuditBar scope="clinic" model={clinic} {...rest} />
        </Card>
    );
}
