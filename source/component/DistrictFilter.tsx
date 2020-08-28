import {
    WebCellProps,
    component,
    mixin,
    watch,
    attribute,
    createCell,
    Fragment
} from 'web-cell';
import { observer } from 'mobx-web-cell';
import { FieldProps } from 'boot-cell/source/Form/Field';
import { DropMenu, DropMenuItem } from 'boot-cell/source/Navigator/DropMenu';

import { area } from '../model';

export interface District {
    province?: string;
    city?: string;
    district?: string;
}

export type DistrictFilterProps = FieldProps & WebCellProps & District;

export interface DistrictEvent extends CustomEvent {
    detail: District;
}

@observer
@component({
    tagName: 'district-filter',
    renderTarget: 'children'
})
export class DistrictFilter extends mixin<DistrictFilterProps>() {
    @attribute
    @watch
    province = '';

    @attribute
    @watch
    city = '';

    @attribute
    @watch
    district = '';

    connectedCallback() {
        this.classList.add('d-flex', 'flex-wrap');

        super.connectedCallback();
    }

    async change(level: keyof District, name: string) {
        const all = name === '全部';

        this[level] = name;

        switch (level) {
            case 'province':
                this.city = this.district = '';
                area.cities.length = area.districts.length = 0;
                if (!all) await area.getSubs('city', name);
                break;
            case 'city':
                this.district = '';
                area.districts.length = 0;
                if (!all) await area.getSubs('district', name);
                break;
        }

        const { defaultSlot, ...data } = this.props;

        this.emit(
            'change',
            Object.fromEntries(
                Object.entries(data).filter(
                    ([key, value]) => value && value !== '全部'
                )
            )
        );
    }

    render({ province, city, district }: DistrictFilterProps) {
        const allItem = { name: '全部' };

        return (
            <>
                <DropMenu
                    className="mr-3 mb-3"
                    caption={`省 | ${province || '全部'}`}
                >
                    {[allItem, ...area.provinces].map(({ name }) => (
                        <DropMenuItem
                            onClick={() => this.change('province', name)}
                        >
                            {name}
                        </DropMenuItem>
                    ))}
                </DropMenu>
                <DropMenu
                    className="mr-3 mb-3"
                    caption={`市 | ${city || '全部'}`}
                >
                    {[allItem, ...area.cities].map(({ name }) => (
                        <DropMenuItem onClick={() => this.change('city', name)}>
                            {name}
                        </DropMenuItem>
                    ))}
                </DropMenu>
                <DropMenu
                    className="mr-3 mb-3"
                    caption={`区 | ${district || '全部'}`}
                >
                    {[allItem, ...area.districts].map(({ name }) => (
                        <DropMenuItem
                            onClick={() => this.change('district', name)}
                        >
                            {name}
                        </DropMenuItem>
                    ))}
                </DropMenu>
            </>
        );
    }
}
