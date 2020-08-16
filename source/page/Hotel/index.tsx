import { component, createCell } from 'web-cell';
import { observer } from 'mobx-web-cell';

import { Card } from 'boot-cell/source/Content/Card';
import { Button } from 'boot-cell/source/Form/Button';
import { DropMenu, DropMenuItem } from 'boot-cell/source/Navigator/DropMenu';

import { hotel, Hotel } from '../../model';
import { AuditBar, CardsPage } from '../../component';

@observer
@component({
    tagName: 'hotel-page',
    renderTarget: 'children'
})
export class HotelPage extends CardsPage<Hotel> {
    scope = 'hotel';
    model = hotel;
    name = '湖北同胞住宿指南';
    districtFilter = true;

    renderItem = ({
        url,
        name,
        capacity,
        province,
        city,
        district,
        address,
        remark,
        coords: { latitude, longitude },
        contacts,
        ...rest
    }: Hotel) => (
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
            footer={<AuditBar scope="hotel" model={hotel} {...rest} />}
        >
            <p>
                可接待人数：
                <span className="badge badge-danger">{capacity}</span>
            </p>
            <p>地址：{province + city + district + address}</p>

            {remark && <p className="text-muted">{remark}</p>}

            <div className="text-center">
                <Button
                    target="_top"
                    href={
                        '//uri.amap.com/marker?' +
                        new URLSearchParams({
                            src: self.location.origin,
                            position: [longitude, latitude].join(),
                            name,
                            callnative: '1'
                        })
                    }
                >
                    地图导航
                </Button>

                {contacts[0] && (
                    <DropMenu
                        className="d-inline-block ml-3"
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
        </Card>
    );
}
