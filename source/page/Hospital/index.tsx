import { component, createCell } from 'web-cell';
import { observer } from 'mobx-web-cell';

import { Card } from 'boot-cell/source/Content/Card';
import { Button } from 'boot-cell/source/Form/Button';
import { DropMenu } from 'boot-cell/source/Navigator/DropMenu';

import { suppliesRequirement, SuppliesRequirement } from '../../model';
import { AuditBar, CardsPage } from '../../component';

@observer
@component({
    tagName: 'hospital-page',
    renderTarget: 'children'
})
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
        <Card
            className="mx-auto mb-4 mx-sm-1"
            style={{ minWidth: '20rem', maxWidth: '20rem' }}
            title={hospital}
            footer={
                <AuditBar
                    scope="hospital"
                    model={suppliesRequirement}
                    {...rest}
                />
            }
        >
            <ol>
                {supplies.map(({ name, count, remark }) => (
                    <li title={remark}>
                        {name}{' '}
                        <span className="badge badge-danger">{count}个</span>
                    </li>
                ))}
            </ol>

            <div className="text-center">
                <Button
                    onClick={() =>
                        this.clip2board(province + city + district + address)
                    }
                >
                    邮寄地址
                </Button>

                {contacts[0] && (
                    <DropMenu
                        className="d-inline-block ml-3"
                        alignType="right"
                        title="联系方式"
                        list={contacts.map(({ name, phone }) => ({
                            title: `${name}：${phone}`,
                            href: 'tel:' + phone
                        }))}
                    />
                )}
            </div>
        </Card>
    );
}
