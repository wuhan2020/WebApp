import { component, observer } from 'web-cell';
import {
    Card,
    CardBody,
    CardFooter,
    CardTitle,
    Badge,
    Button,
    DropdownButton,
    DropdownItem
} from 'boot-cell';

import { hotel, Hotel } from '../../model';
import { AuditBar } from '../../component/AuditBar';
import { CardsPage } from '../../component/CardsPage';

@component({ tagName: 'hotel-page' })
@observer
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
        <Card>
            <CardBody>
                <CardTitle>
                    {url ? (
                        <a
                            className="text-decoration-none"
                            target="_blank"
                            href={url}
                        >
                            {name}
                        </a>
                    ) : (
                        name
                    )}
                </CardTitle>
                <p>
                    可接待人数：
                    <Badge bg="danger">{capacity}</Badge>
                </p>
                <p>地址：{province + city + district + address}</p>

                {remark && <p className="text-muted">{remark}</p>}

                <div className="text-center">
                    <Button
                        variant="primary"
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
                        <DropdownButton
                            className="d-inline-block ms-3"
                            variant="primary"
                            // alignType="right"
                            caption="联系方式"
                        >
                            {contacts.map(({ name, phone }) => (
                                <DropdownItem href={'tel:' + phone}>
                                    {name}：{phone}
                                </DropdownItem>
                            ))}
                        </DropdownButton>
                    )}
                </div>
            </CardBody>
            <CardFooter>
                <AuditBar scope="hotel" model={hotel} {...rest} />
            </CardFooter>
        </Card>
    );
}
