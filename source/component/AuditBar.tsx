import { createCell, Fragment } from 'web-cell';
import { Button } from 'boot-cell/source/Form/Button';

import { relativeTimeTo, TimeUnitName } from '../utility';
import { DataItem, User } from '../service';
import { session, BaseModel } from '../model';

interface AuditBarProps extends DataItem {
    scope: string;
    creator?: User;
    model: BaseModel;
}

export function AuditBar({
    createdAt,
    creator: { objectId: uid, mobilePhoneNumber },
    objectId,
    scope,
    model
}: AuditBarProps) {
    const { distance, unit } = relativeTimeTo(createdAt),
        authorized =
            session.user?.objectId === uid || session.hasRole('Admin') || null;

    return (
        <footer className="mt-3 text-center text-mute">
            <a href={'tel:' + mobilePhoneNumber}>{mobilePhoneNumber}</a> 发布于{' '}
            {Math.abs(distance)} {TimeUnitName[unit]}前
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
