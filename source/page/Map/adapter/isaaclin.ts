import {
    CountryOverviewData,
    CountryData,
    ProvinceData,
    CityData,
    PatientStatData,
    Series
} from './patientStatInterface';
import { long2short } from './long2short'; // some city names are NOT short names so we also convert them here

function convertStat(source): PatientStatData {
    return {
        confirmed: source.confirmedCount,
        suspected: source.suspectedCount,
        cured: source.curedCount,
        dead: source.deadCount
    };
}

interface City {
    cityName: string;
}

interface Province {
    provinceShortName: string;
    cities?: City[];
    updateTime: number;
}

export function convertCountry(source: Province[]): CountryData {
    // currently we only support china
    return {
        name: '中国',
        confirmed: 0,
        suspected: 0,
        cured: 0,
        dead: 0,
        provinces: Object.fromEntries(
            source.map(item => [item.provinceShortName, convertProvince(item)])
        )
    };
}

export function convertProvince(province: Province): ProvinceData {
    const { provinceShortName: name, updateTime, cities } = province;

    return {
        name,
        timestamp: updateTime,
        cities:
            cities &&
            Object.fromEntries(
                cities.map(item => [
                    long2short(item.cityName),
                    convertCity(item, updateTime)
                ])
            ),
        ...convertStat(province)
    };
}

export function convertCity(source: City, updateTime: number): CityData {
    return {
        name: long2short(source.cityName),
        timestamp: updateTime, // 使用传入的省级数据更新时间
        ...convertStat(source)
    };
}

function roundTime(t: number, resolution: number) {
    const offset = resolution >= 24 * 3600000 ? 8 * 3600000 : 0; // consider locale if resolution > 1 day

    return Math.floor((t + offset) / resolution) * resolution - offset;
}

function fillForward<T extends ProvinceData | CityData | CountryData>(
    series: Series<T>
) {
    const all_ts = Object.keys(series).sort();

    all_ts.forEach((t, i) => {
        if (i < all_ts.length - 1)
            for (const name of Object.keys(series[t])) {
                const next_t = parseInt(all_ts[i + 1], 10);

                if (series[next_t][name] === undefined)
                    series[next_t][name] = series[t][name];
            }
    });
}

export function convertProvincesSeries(
    source: Province[],
    resolution: number, // in ms
    shouldFillForward = false
): Series<ProvinceData> {
    let res: Series<ProvinceData> = {};

    source.sort(item => item.updateTime);

    for (const item of source) {
        const t = roundTime(item.updateTime, resolution);

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
): Series<CityData> {
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

export function convertCountrySeries(
    source: any[],
    resolution: number // in ms
): Series<CountryOverviewData> {
    return Object.fromEntries(
        source.map(item => [roundTime(item.updateTime, resolution), item])
    );
}
