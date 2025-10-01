// 疫情数据调用封装
// NOTE: 访问接口地址并不是和系统对应的接口是同一服务
import { EpidemicAreaDaily, EpidemicOverall } from '@wuhan2020/rest-api';
import { registerMap } from 'echarts';
import { HTTPClient } from 'koajax';
import { computed, observable } from 'mobx';
import { Filter, persist, restore, toggle } from 'mobx-restful';
import { groupBy, sum } from 'web-utility';

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

export class AreaDailyModel extends TableModel<EpidemicAreaDaily> {
    baseURI = 'epidemic/area-daily';

    @computed
    get currentCountryCounts() {
        const { countryName, countryEnglishName } = this.filter;

        if (!countryName && !countryEnglishName) return [];

        const provinceGroup = groupBy(this.allItems, 'provinceName');

        return Object.entries(provinceGroup).map(([name, provinceData]) => {
            const value = sum(
                ...provinceData.map(
                    ({ provinceSuspectedCount, provinceConfirmedCount, provinceDeadCount }) =>
                        sum(provinceSuspectedCount, provinceConfirmedCount, provinceDeadCount)
                )
            );
            return { name, value };
        });
    }

    @computed
    get currentProvinceCounts() {
        const { provinceName, provinceEnglishName } = this.filter;

        if (!provinceName && !provinceEnglishName) return [];

        const cityGroup = groupBy(this.allItems, 'cityName');

        return Object.entries(cityGroup).map(([name, cityData]) => {
            const value = sum(
                ...cityData.map(({ citySuspectedCount, cityConfirmedCount, cityDeadCount }) =>
                    sum(citySuspectedCount, cityConfirmedCount, cityDeadCount)
                )
            );
            return { name, value };
        });
    }

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

    async getList(filter?: Filter<EpidemicAreaDaily>, pageIndex?: number, pageSize?: number) {
        await this.restored;

        const areaName = filter?.countryName || filter?.provinceName;

        this.mapData[areaName] ??= await this.loadMapData(areaName);

        return super.getList(filter, pageIndex, pageSize);
    }
}

export async function getOverall() {
    const { body } = await epidemic.get<EpidemicOverall[]>('Overall', { Range: '0-9' });

    return body;
}
export async function getHistory(date = '2022-09-01') {
    const startOfDay = `${date}T00:00:00`;
    const endOfDay = `${date}T23:59:59`;

    const { body } = await epidemic.get<EpidemicAreaDaily[]>(
        `Area?${new URLSearchParams([
            ['updateTime', `gt.${startOfDay}`],
            ['updateTime', `lt.${endOfDay}`],
            ['countryName', 'eq.中国'],
            ['limit', '299']
        ])}`
    );

    const updatedBody = body.map(item => ({
        id: item.id,
        updateTime: item.updateTime,
        provinceShortName: item.provinceName,
        confirmedCount: item.provinceConfirmedCount,
        suspectedCount: item.provinceSuspectedCount,
        curedCount: item.provinceCuredCount,
        deadCount: item.provinceDeadCount
    }));

    return updatedBody as Province[];
}

export async function getCurrent() {
    const { body } = await epidemic.get<Province[]>('Area', { Range: '0-9' });

    return body;
}
