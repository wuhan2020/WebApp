import { component, createCell } from 'web-cell';
import { observer } from 'mobx-web-cell';

import { Card } from 'boot-cell/source/Content/Card';

import { CardsPage, AuditBar } from '../../component';
import { clinic, Clinic } from '../../model';
import { getIsLive } from './time';
import './index.css'

@observer
@component({
    tagName: 'clinic-list',
    renderTarget: 'children'
})
export class ClinicList extends CardsPage<Clinic> {
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
    }: Clinic) => {
        const isLive = getIsLive(startTime, endTime);
        return <Card
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
                {isLive?<div className="clinic-card__live-label">正在接诊</div>:null}
                <p>
                    每日接诊起止时间：{startTime} ~ {endTime}
                </p>
                {contacts[0] && (
                    <ol className="list-unstyled">
                        {contacts.map(({ name, phone }) => (
                            <li>
                                <a href={'tel:' + phone}>
                                    <i className="fa fa-phone d-inline-block bg-primary text-white p-1 rounded" />{' '}
                                    {name}：{phone}
                                </a>
                            </li>
                        ))}
                    </ol>
                )}
                {remark && <p className="text-muted">{remark}</p>}

                <AuditBar scope="clinic" model={clinic} {...rest} />
            </Card>
    };
}
