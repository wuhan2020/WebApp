import { OrganizationBase, VerificationBase } from '@wuhan2020/rest-api';
import { Button, ButtonGroup } from 'boot-cell';
import { FC, observer } from 'web-cell';
import { diffTime } from 'web-utility';

import { session, VerifiableModel } from '../model';
import { TimeUnitName } from '../utility';

export interface AuditBarProps<T extends VerificationBase> extends OrganizationBase {
    scope: string;
    model: VerifiableModel<T>;
}

const TimeStamp: FC<Record<'date' | 'phone' | 'label', string>> = ({ date, phone, label }) => {
    const { distance, unit } = diffTime(date);

    return (
        <time className="d-block small text-center text-muted" dateTime={date}>
            <a href={'tel:' + phone}>{phone}</a> {label}于 {Math.abs(distance)} {TimeUnitName[unit]}
            前
        </time>
    );
};

export const AuditBar = observer(function <T extends VerificationBase>(props: AuditBarProps<T>) {
    const { createdAt, updatedAt, createdBy, verifiedAt, verifiedBy, id, scope, model } = props;
    const isAdmin = session.hasRole('Admin');
    const authorized = session.user?.id === createdBy.id || isAdmin;

    return (
        <>
            <TimeStamp label="发布" date={createdAt} phone={createdBy.mobilePhone} />

            {verifiedAt && (
                <TimeStamp label="审核" date={updatedAt} phone={verifiedBy.mobilePhone} />
            )}
            {authorized && (
                <ButtonGroup className="d-flex mt-2">
                    <Button variant="warning" size="sm" href={scope + '/edit?dataId=' + id}>
                        编辑
                    </Button>
                    {isAdmin && !verifiedAt && (
                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => (model as VerifiableModel).verify(id)}
                        >
                            审核
                        </Button>
                    )}
                    <Button variant="danger" size="sm" onClick={() => model.deleteOne(id)}>
                        删除
                    </Button>
                </ButtonGroup>
            )}
        </>
    );
});
