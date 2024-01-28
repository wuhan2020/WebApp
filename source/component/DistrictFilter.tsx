import { WebCell, component, attribute, observer } from 'web-cell';
import { observable } from 'mobx';
import { FormControlProps, DropdownButton, DropdownItem } from 'boot-cell';

import { area } from '../model';
import { GeoCode } from '../service';

export type District = Partial<Pick<GeoCode, 'province' | 'city' | 'district'>>;

export type DistrictFilterProps = FormControlProps<'input'> & District;

export interface DistrictEvent extends CustomEvent {
    detail: District;
}

export interface DistrictFilter extends WebCell<DistrictFilterProps> {}

@component({ tagName: 'district-filter' })
@observer
export class DistrictFilter
    extends HTMLElement
    implements WebCell<DistrictFilterProps>
{
    @attribute
    @observable
    accessor province = '';

    @attribute
    @observable
    accessor city = '';

    @attribute
    @observable
    accessor district = '';

    connectedCallback() {
        this.classList.add('d-flex', 'flex-wrap', 'gap-2');
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

        const { province, city, district } = this;

        this.emit(
            'change',
            Object.fromEntries(
                Object.entries({ province, city, district }).filter(
                    ([key, value]) => value && value !== '全部'
                )
            )
        );
    }

    render() {
        const { province, city, district } = this,
            allItem = { name: '全部' };

        return (
            <>
                <DropdownButton
                    className="me-3 mb-3"
                    variant="primary"
                    caption={`省 | ${province || '全部'}`}
                >
                    {[allItem, ...area.provinces].map(({ name }) => (
                        <DropdownItem
                            onClick={() => this.change('province', name)}
                        >
                            {name}
                        </DropdownItem>
                    ))}
                </DropdownButton>
                <DropdownButton
                    className="me-3 mb-3"
                    variant="primary"
                    caption={`市 | ${city || '全部'}`}
                >
                    {[allItem, ...area.cities].map(({ name }) => (
                        <DropdownItem onClick={() => this.change('city', name)}>
                            {name}
                        </DropdownItem>
                    ))}
                </DropdownButton>
                <DropdownButton
                    className="me-3 mb-3"
                    variant="primary"
                    caption={`区 | ${district || '全部'}`}
                >
                    {[allItem, ...area.districts].map(({ name }) => (
                        <DropdownItem
                            onClick={() => this.change('district', name)}
                        >
                            {name}
                        </DropdownItem>
                    ))}
                </DropdownButton>
            </>
        );
    }
}
