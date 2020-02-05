import { createCell, Fragment } from 'web-cell';
import { Button } from 'boot-cell/source/Form/Button';

import { relativeTimeTo, TimeUnitName } from '../utility';
import { DataItem, User } from '../service';
import { session, BaseModel, VerifiableModel } from '../model';

interface AuditBarProps extends DataItem {
    scope: string;
    creator?: User;
    verified?: boolean;
    verifier?: User;
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
    const { distance, unit } = relativeTimeTo(date);

    return (
        <p className="text-muted">
            <a href={'tel:' + phone}>{phone}</a> {label}于 {Math.abs(distance)}{' '}
            {TimeUnitName[unit]}前
        </p>
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
        <footer className="mt-3 text-center text-mute">
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
                <Fragment>
                    <Button
                        kind="warning"
                        block
                        className="mt-3"
                        href={scope + '/edit?dataId=' + objectId}
                    >
                        编辑
                    </Button>
                    {!isAdmin || verified ? null : (
                        <Button
                            kind="success"
                            block
                            className="mt-3"
                            onClick={() =>
                                (model as VerifiableModel).verify(objectId)
                            }
                        >
                            审核
                        </Button>
                    )}
                    <Button
                        kind="danger"
                        block
                        className="mt-3"
                        onClick={() => model.delete(objectId)}
                    >
                        删除
                    </Button>
                </Fragment>
            )}
        </footer>
    );
}
