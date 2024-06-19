import { observable } from 'mobx';
import { BaseModel, persist, restore, toggle } from 'mobx-restful';

import { District, getSubDistricts } from '../service';

export class AreaModel extends BaseModel {
    @persist()
    @observable
    accessor provinces: District[] = [];

    @observable
    accessor cities: District[] = [];

    @observable
    accessor districts: District[] = [];

    constructor() {
        super();
        restore(this, 'area').then(async () => {
            if (!this.provinces[0]) this.provinces = await getSubDistricts();
        });
    }

    @toggle('downloading')
    async getSubs(type: 'city' | 'district', parent: string) {
        const list = await getSubDistricts(parent);

        if (type === 'city') this.cities = list;
        else this.districts = list;
    }
}
