// 疫情数据调用封装
// NOTE: 访问接口地址并不是和系统对应的接口是同一服务
import { HTTPClient } from 'koajax';

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
    updateTime: Date;
}

export type StatisticType =
    | 'suspected'
    | 'confirmed'
    | 'serious'
    | 'cured'
    | 'dead';
export type StatisticData = Record<
    `${StatisticType | 'currentConfirmed'}Count`,
    number
>;
export type IncreasingData = Record<
    `${StatisticType | 'currentConfirmed' | `yesterday${'Confirmed' | 'Suspected'}Count`}Incr`,
    number
>;

export type AreaType = 'hbFeiHb' | 'quanguo' | 'foreign';

export interface Overall
    extends Base,
        StatisticData,
        Partial<IncreasingData>,
        Partial<Record<`${'mid' | 'high'}DangerCount`, number>>,
        Partial<
            Record<
                | 'dailyPics'
                | 'summary'
                | `${'count' | 'general' | 'abroad'}Remark`
                | `remark${1 | 2 | 3 | 4 | 5}`
                | `note${1 | 2 | 3}`,
                string
            >
        >,
        Record<`${'foreign' | 'global'}Statistics`, null>,
        Record<`${AreaType}TrendChart`, null>,
        Record<`importantForeignTrendChart${'' | 'Global'}`, null> {
    dailyPic: string;
    marquee?: any[];
    foreignTrendChartGlobal?: any;
    globalOtherTrendChartData?: string;
}

export interface City extends Base, StatisticData {
    cityName: string;
}

export interface Province extends Base, StatisticData {
    provinceShortName: string;
    cities?: City[];
}

export async function getOverall() {
    const { body } = await epidemic.get<Overall[]>('Overall', { Range: '0-9' });

    return body;
}

export async function getHistory() {
    const { body } = await epidemic.get<Province[]>('Area', { Range: '0-9' });

    return body;
}

export async function getCurrent() {
    const { body } = await epidemic.get<Province[]>('Area', { Range: '0-9' });

    return body;
}
