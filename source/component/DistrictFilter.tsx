import {
    component,
    mixin,
    watch,
    attribute,
    createCell,
    Fragment
} from 'web-cell';
import { observer } from 'mobx-web-cell';
import { DropMenu } from 'boot-cell/source/Navigator/DropMenu';

import { area } from '../model';

export interface DistrictFilterProps {
    province?: string;
    city?: string;
    district?: string;
}

export interface DistrictEvent extends CustomEvent {
    detail: {
        level: keyof DistrictFilterProps;
        name: string;
    };
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
        this.classList.add('d-flex');
    }

    async change(level: keyof DistrictFilterProps, name: string) {
        const all = name === '全部';

        this[level] = name;

        switch (level) {
            case 'province':
                this.city = this.district = '全部';
                area.cities.length = area.districts.length = 0;
                if (!all) {
                    await area.getSubs('city', name);
                }
                break;
            case 'city':
                this.district = '全部';
                area.districts.length = 0;
                if (!all) {
                    await area.getSubs('district', name);
                }
                break;
        }

        this.emit('change', { level, name: all ? '' : name });
    }

    render({ province, city, district }: DistrictFilterProps) {
        const allItem = { name: '全部' };

        return (
            <Fragment>
                <DropMenu
                    className="mr-3 mb-3"
                    title={`省 | ${province || '全部'}`}
                    list={[allItem, ...area.provinces].map(({ name }) => ({
                        title: name,
                        href: '#hospital',
                        onClick: () => this.change('province', name)
                    }))}
                />
                <DropMenu
                    className="mr-3 mb-3"
                    title={`市 | ${city || '全部'}`}
                    list={[allItem, ...area.cities].map(({ name }) => ({
                        title: name,
                        href: '#hospital',
                        onClick: () => this.change('city', name)
                    }))}
                />
                <DropMenu
                    className="mr-3 mb-3"
                    title={`区 | ${district || '全部'}`}
                    list={[allItem, ...area.districts].map(({ name }) => ({
                        title: name,
                        href: '#hospital',
                        onClick: () => this.change('district', name)
                    }))}
                />
            </Fragment>
        );
    }
}
