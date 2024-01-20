import { observable } from 'mobx';

import { District, getSubDistricts } from '../service';

export class AreaModel {
    @observable
    accessor provinces: District[] = [];

    @observable
    accessor cities: District[] = [];

    @observable
    accessor districts: District[] = [];

    constructor() {
        getSubDistricts().then(list => (this.provinces = list));
    }

    async getSubs(type: 'city' | 'district', parent: string) {
        const list = await getSubDistricts(parent);

        if (type === 'city') this.cities = list;
        else this.districts = list;
    }
}
