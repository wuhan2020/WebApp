import { observable } from 'mobx';

import { getSubDistricts } from '../AMap';

export class AreaModel {
    @observable
    provinces = [];

    @observable
    cities = [];

    @observable
    districts = [];

    constructor() {
        getSubDistricts().then(list => (this.provinces = list));
    }

    async getSubs(type: 'city' | 'district', parent: string) {
        const list = await getSubDistricts(parent);

        if (type === 'city') this.cities = list;
        else this.districts = list;
    }
}
