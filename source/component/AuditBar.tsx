import { createCell, Fragment } from 'web-cell';
import { diffTime } from 'web-utility';
import { Button } from 'boot-cell/source/Form/Button';

import { TimeUnitName } from '../utility';
import { DataItem, Organization } from '../service';
import { session, BaseModel, VerifiableModel } from '../model';

interface AuditBarProps extends DataItem, Organization {
    scope: string;
    model: BaseModel;
}

function TimeStamp({
    date,
    phone,
    label
}: {
    date: string;
    phone: string;
    label: string;
}) {
    const { distance, unit } = diffTime(date);

    return (
        <small className="d-block text-center text-muted">
            <a href={'tel:' + phone}>{phone}</a> {label}于 {Math.abs(distance)}{' '}
            {TimeUnitName[unit]}前
        </small>
    );
}

export function AuditBar({
    createdAt,
    updatedAt,
    creator,
    verified,
    verifier,
    objectId,
    scope,
    model
}: AuditBarProps) {
    const isAdmin = session.hasRole('Admin');
    const authorized =
        session.user?.objectId === creator.objectId || isAdmin || null;

    return (
        <Fragment>
            <TimeStamp
                label="发布"
                date={createdAt}
                phone={creator.mobilePhoneNumber}
            />
            {!verified ? null : (
                <TimeStamp
                    label="审核"
                    date={updatedAt}
                    phone={verifier.mobilePhoneNumber}
                />
            )}
            {authorized && (
                <div className="btn-group d-flex mt-2">
                    <Button
                        kind="warning"
                        size="sm"
                        href={scope + '/edit?dataId=' + objectId}
                    >
                        编辑
                    </Button>
                    {!isAdmin || verified ? null : (
                        <Button
                            kind="success"
                            size="sm"
                            onClick={() =>
                                (model as VerifiableModel).verify(objectId)
                            }
                        >
                            审核
                        </Button>
                    )}
                    <Button
                        kind="danger"
                        size="sm"
                        onClick={() => model.delete(objectId)}
                    >
                        删除
                    </Button>
                </div>
            )}
        </Fragment>
    );
}
