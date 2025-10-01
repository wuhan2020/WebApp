import { Vendor } from '@wuhan2020/rest-api';
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardTitle,
    DropdownButton,
    DropdownItem
} from 'boot-cell';
import { component, observer } from 'web-cell';

import { AuditBar } from '../../component/AuditBar';
import { CardsPage } from '../../component/CardsPage';
import { factory, VerifiableModel } from '../../model';

@component({ tagName: 'factory-page' })
@observer
export default class FactoryPage extends CardsPage<Vendor> {
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
    }: Vendor) => (
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
                <p>
                    资质证明：<code>{qualification}</code>
                </p>
                <p>地址：{province + city + district + address}</p>

                <h6>物资产能</h6>
                <ol>
                    {supplies.map(({ name, count, remark }) => (
                        <li key={name} title={remark}>
                            {name} <Badge bg="danger">{count}个</Badge>
                        </li>
                    ))}
                </ol>

                {remark && <p className="text-muted">{remark}</p>}

                <div className="text-center">
                    <Button
                        variant="primary"
                        onClick={() => this.clip2board(province + city + district + address)}
                    >
                        复制地址
                    </Button>
                    {contacts[0] && (
                        <DropdownButton
                            className="d-inline-block ms-3"
                            variant="primary"
                            // alignType="right"
                            caption="联系方式"
                        >
                            {contacts.map(({ name, phone }) => (
                                <DropdownItem key={name} href={'tel:' + phone}>
                                    {name}：{phone}
                                </DropdownItem>
                            ))}
                        </DropdownButton>
                    )}
                </div>
            </CardBody>
            <CardFooter>
                <AuditBar
                    scope="factory"
                    model={factory as VerifiableModel}
                    name={name}
                    {...rest}
                />
            </CardFooter>
        </Card>
    );
}
