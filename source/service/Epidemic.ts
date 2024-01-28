// 疫情数据调用封装
// NOTE: 访问接口地址并不是和系统对应的接口是同一服务
import { DataObject } from 'dom-renderer';
import { HTTPClient } from 'koajax';

// @credit: https://lab.ahusmart.com/nCoV/api/ 提供了丁香园的疫情数据
// @credit: https://lab.isaaclin.cn/nCoV/ 同样提供了丁香园的疫情数据

export const epidemic = new HTTPClient({
    baseURI: 'https://lab.ahusmart.com/nCoV/api/',
    responseType: 'json'
});

interface MapData<T = DataObject> {
    results: T[];
}

export type StatisticType = 'confirmed' | 'suspected' | 'cured' | 'dead';

export type StatisticData = Record<`${StatisticType}Count`, number>;

export interface City extends StatisticData {
    cityName: string;
}

export interface Province extends StatisticData {
    provinceShortName: string;
    cities?: City[];
    updateTime: number;
}

export async function getOverall() {
    const {
        body: { results }
    } = await epidemic.get<MapData>('overall?latest=0');

    return results;
}

export async function getHistory() {
    const {
        body: { results }
    } = await epidemic.get<MapData<Province>>('area?latest=0');

    return results;
}

export async function getCurrent() {
    const {
        body: { results }
    } = await epidemic.get<MapData<Province>>('area');

    return results;
}
