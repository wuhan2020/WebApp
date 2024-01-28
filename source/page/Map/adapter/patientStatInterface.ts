import { StatisticType } from '../../../service';

export type PatientStatData = Record<StatisticType, number>;

export type CountryOverviewData = CityData;

export interface CountryData extends CityData {
    provinces?: Record<string, ProvinceData>;
}

export interface ProvinceData extends CityData {
    cities: Record<string, CityData>;
}

export interface CityData extends PatientStatData {
    name: string; // '武汉'
    /**
     * integer, unit is 'ms', unix epoch time
     */
    timestamp?: number;
}

export type Series<T extends CountryData | ProvinceData | CityData> = {
    [timestamp: number]: Record<string, T>;
};

export interface OverallCountryData {
    provincesSeries: Series<ProvinceData>;
    countrySeries: Series<CountryOverviewData>;
}
