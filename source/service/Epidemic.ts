// 疫情数据调用封装
// NOTE: 访问接口地址并不是和系统对应的接口是同一服务
import {
    EpidemicAreaDaily,
    EpidemicCityMonthly,
    EpidemicCountryMonthly,
    EpidemicProvinceMonthly
} from '@wuhan2020/rest-api';
import { registerMap } from 'echarts';
import { HTTPClient } from 'koajax';
import { observable } from 'mobx';
import { Filter, persist, restore, toggle } from 'mobx-restful';

import { TableModel } from '../model';
import { GeoJSON } from '../model/Area';
import province from '../page/Map/data/province';

// @credit: https://github.com/BlankerL/DXY-COVID-19-Data 提供了丁香园的疫情数据

const apikey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkeWNwY3l4Z2pqcHV1dmV5aWVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg4NDkzMDEsImV4cCI6MjAyNDQyNTMwMX0.EwwLK6PX2l5BgahNnPwzRINS-_ZI2AJCY2jR-SpzJdw';

export const epidemic = new HTTPClient({
    baseURI: 'https://idycpcyxgjjpuuveyieg.supabase.co/rest/v1/',
    responseType: 'json'
}).use(({ request }, next) => {
    request.headers = {
        ...request.headers,
        apikey,
        Authorization: `Bearer ${apikey}`
    };
    return next();
});

export interface Base {
    id: number;
    updateTime?: string;
}

export type StatisticType = 'suspected' | 'confirmed' | 'serious' | 'cured' | 'dead';
export type StatisticData = Partial<
    Record<`${StatisticType | 'currentConfirmed'}Count`, number | string>
>;

export interface City extends Base, StatisticData {
    cityName: string;
}

export interface Province extends Base, StatisticData {
    provinceShortName: string;
    cities?: City[];
}

export type EpidemicAreaMonthly = EpidemicAreaDaily & EpidemicCityMonthly;

export abstract class AreaMonthlyModel<T extends EpidemicAreaMonthly> extends TableModel<T> {
    @persist()
    @observable
    accessor mapData: Record<string, GeoJSON> = {};

    restored = restore(this, 'AreaDaily').then(() => {
        for (const areaName in this.mapData) registerMap(areaName, this.mapData[areaName]);
    });

    @toggle('downloading')
    async loadMapData(areaName = '') {
        const mapURL = province[areaName] || province.世界;

        const data: GeoJSON = await (await fetch(mapURL)).json();

        registerMap(areaName, data);

        return data;
    }

    async getList(filter?: Filter<T>, pageIndex?: number, pageSize?: number) {
        await this.restored;

        const { countryName, provinceName } = (filter || {}) as Filter<EpidemicAreaMonthly>;

        const areaName = countryName || provinceName;

        this.mapData[areaName] ??= await this.loadMapData(areaName);

        return super.getList(filter, pageIndex, pageSize);
    }
}

export class CountryMonthlyModel extends AreaMonthlyModel<
    EpidemicCountryMonthly & Required<EpidemicAreaDaily>
> {
    baseURI = 'epidemic/area-monthly/country';
}

export class ProvinceMonthlyModel extends AreaMonthlyModel<
    EpidemicProvinceMonthly & Required<EpidemicAreaDaily>
> {
    baseURI = 'epidemic/area-monthly/province';
}

export class CityMonthlyModel extends AreaMonthlyModel<
    EpidemicCityMonthly & Required<EpidemicAreaDaily>
> {
    baseURI = 'epidemic/area-monthly/city';
}
