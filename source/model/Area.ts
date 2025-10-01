import { registerMap } from 'echarts';
import { HTTPClient } from 'koajax';
import { observable } from 'mobx';
import { BaseModel, persist, restore, toggle } from 'mobx-restful';

import { server_root } from '../page/Map/data/province';
import { District, getSubDistricts } from '../service';

export interface Area {
    adcode: number | string;
    adchar?: string;
    name: string;
    center?: number[];
    centroid?: number[];
    level?: 'province' | 'city' | 'district';
    parent?: { adcode: number };
    childrenNum?: number;
    subFeatureIndex?: number;
    acroutes?: number[];
}

type ExtractGeoJSON<T> = T extends { type: 'FeatureCollection' }
    ? T extends { UTF8Encoding?: boolean }
        ? never
        : T
    : never;

export type GeoJSON = ExtractGeoJSON<Parameters<typeof registerMap>[1]>;

export const dataVClient = new HTTPClient({
    baseURI: server_root,
    responseType: 'json'
});

export class AreaModel extends BaseModel {
    @persist()
    @observable
    accessor provinces: District[] = [];

    @observable
    accessor cities: District[] = [];

    @observable
    accessor districts: District[] = [];

    restored = restore(this, 'area').then(async () => {
        if (!this.provinces[0]) this.provinces = await getSubDistricts();
    });

    @toggle('downloading')
    async getSubs(type: 'city' | 'district', parent: string) {
        return type === 'city'
            ? (this.cities = await getSubDistricts(parent, 'city'))
            : (this.districts = await getSubDistricts(parent, 'district'));
    }
}
