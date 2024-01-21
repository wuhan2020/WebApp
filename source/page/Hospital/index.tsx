import { component, observer } from 'web-cell';
import {
    Card,
    CardBody,
    CardFooter,
    CardTitle,
    Button,
    DropdownButton,
    DropdownItem,
    Badge
} from 'boot-cell';

import { suppliesRequirement, SuppliesRequirement } from '../../model';
import { AuditBar } from '../../component/AuditBar';
import { CardsPage } from '../../component/CardsPage';

@component({ tagName: 'hospital-page' })
@observer
export class HospitalPage extends CardsPage<SuppliesRequirement> {
    scope = 'hospital';
    model = suppliesRequirement;
    name = '医疗物资需求';
    districtFilter = true;

    renderItem = ({
        hospital,
        supplies = [],
        province,
        city,
        district,
        address,
        contacts,
        ...rest
    }: SuppliesRequirement) => (
        <Card>
            <CardBody>
                <CardTitle>{hospital}</CardTitle>
                <ol>
                    {supplies.map(({ name, count, remark }) => (
                        <li key={name} title={remark}>
                            {name} <Badge bg="danger">{count}个</Badge>
                        </li>
                    ))}
                </ol>
                <div className="text-center">
                    <Button
                        variant="primary"
                        onClick={() =>
                            this.clip2board(
                                province + city + district + address
                            )
                        }
                    >
                        邮寄地址
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
                <AuditBar
                    scope="hospital"
                    model={suppliesRequirement}
                    {...rest}
                />
            </CardFooter>
        </Card>
    );
}
