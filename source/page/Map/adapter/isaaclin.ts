import { Hour } from 'web-utility';
import {
    CountryOverviewData,
    CountryData,
    ProvinceData,
    CityData,
    PatientStatData,
    Series
} from './patientStatInterface';
import { long2short } from './long2short'; // some city names are NOT short names so we also convert them here
import { Base, City, Province, StatisticData } from '../../../service/Epidemic';

export const convertStat = ({
    id,
    updateTime,
    ...source
}: Base & StatisticData): Base & PatientStatData => ({
    id,
    updateTime,
    suspected: source.suspectedCount,
    confirmed: source.confirmedCount,
    serious: source.seriousCount,
    cured: source.curedCount,
    dead: source.deadCount
});

/**
 * currently we only support china
 */
export const convertCountry = (source: Province[]): CountryData => ({
    name: '中国',
    suspected: 0,
    confirmed: 0,
    serious: 0,
    cured: 0,
    dead: 0,
    provinces: Object.fromEntries(
        source.map(item => [item.provinceShortName, convertProvince(item)])
    )
});

export function convertProvince(province: Province): ProvinceData {
    const { provinceShortName: name, updateTime, cities } = province;

    return {
        name,
        timestamp: +updateTime,
        cities:
            cities &&
            Object.fromEntries(
                cities.map(item => [
                    long2short(item.cityName),
                    convertCity(item, +updateTime)
                ])
            ),
        ...convertStat(province)
    };
}

/**
 * @param timestamp 使用传入的省级数据更新时间
 */
export const convertCity = (source: City, timestamp: number): CityData => ({
    name: long2short(source.cityName),
    timestamp,
    ...convertStat(source)
});

function roundTime(t: number, resolution: number) {
    const offset = resolution >= 24 * Hour ? 8 * Hour : 0; // consider locale if resolution > 1 day

    return Math.floor((t + offset) / resolution) * resolution - offset;
}

function fillForward<T extends ProvinceData | CityData | CountryData>(
    series: Series<T>
) {
    const all_ts = Object.keys(series).sort();

    for (const [i, t] of all_ts.entries())
        if (i < all_ts.length - 1)
            for (const name of Object.keys(series[t])) {
                const next_t = parseInt(all_ts[i + 1], 10);

                if (series[next_t][name] === undefined)
                    series[next_t][name] = series[t][name];
            }
}

/**
 * @param resolution in ms
 */
export function convertProvincesSeries(
    source: Province[],
    resolution: number,
    shouldFillForward = false
) {
    const res: Series<ProvinceData> = {};

    source = [...source].sort(
        ({ updateTime: a }, { updateTime: b }) => +b - +a
    );

    for (const item of source) {
        const t = roundTime(+item.updateTime, resolution);

        if (res[t] === undefined) res[t] = {};

        const prov = convertProvince(item);

        res[t][prov.name] = prov;
    }

    if (shouldFillForward) fillForward(res);

    return res;
}

export function extractCitiesSeries(
    series: Series<ProvinceData>,
    name: string,
    resolution: number,
    shouldFillForward = false
) {
    const res: Series<CityData> = Object.fromEntries(
        Object.values(series)
            .map(provs => {
                const { timestamp, cities } = provs[name] || {};

                if (timestamp != null)
                    return [roundTime(timestamp, resolution), cities];
            })
            .filter(Boolean)
    );

    if (shouldFillForward) fillForward(res);

    return res;
}

/**
 * @param resolution // in ms
 */
export const convertCountrySeries = (
    source: any[],
    resolution: number
): Series<CountryOverviewData> =>
    Object.fromEntries(
        source.map(item => [roundTime(+item.updateTime, resolution), item])
    );
