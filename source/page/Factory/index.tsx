import { component, createCell } from 'web-cell';
import { observer } from 'mobx-web-cell';

import { Button } from 'boot-cell/source/Form/Button';
import { Card, CardFooter } from 'boot-cell/source/Content/Card';
import { DropMenu, DropMenuItem } from 'boot-cell/source/Navigator/DropMenu';

import { factory, Factory } from '../../model';
import { AuditBar, CardsPage } from '../../component';

@observer
@component({
    tagName: 'factory-page',
    renderTarget: 'children'
})
export class FactoryPage extends CardsPage<Factory> {
    scope = 'factory';
    model = factory;
    name = '生产厂商';
    districtFilter = true;

    renderItem = ({
        url,
        name,
        qualification,
        supplies = [],
        province,
        city,
        district,
        address,
        contacts,
        remark,
        ...rest
    }: Factory) => (
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
            <p>
                资质证明：<code>{qualification}</code>
            </p>
            <p>地址：{province + city + district + address}</p>

            <h6>物资产能</h6>
            <ol>
                {supplies.map(({ name, count, remark }) => (
                    <li title={remark}>
                        {name}{' '}
                        <span className="badge badge-danger">{count}个</span>
                    </li>
                ))}
            </ol>

            {remark && <p className="text-muted">{remark}</p>}

            <div className="text-center">
                <Button
                    color="primary"
                    onClick={() =>
                        this.clip2board(province + city + district + address)
                    }
                >
                    复制地址
                </Button>
                {contacts[0] && (
                    <DropMenu
                        className="d-inline-block ml-3"
                        buttonColor="primary"
                        alignType="right"
                        caption="联系方式"
                    >
                        {contacts.map(({ name, phone }) => (
                            <DropMenuItem href={'tel:' + phone}>
                                {name}：{phone}
                            </DropMenuItem>
                        ))}
                    </DropMenu>
                )}
            </div>
            <CardFooter>
                <AuditBar scope="factory" model={factory} {...rest} />
            </CardFooter>
        </Card>
    );
}
