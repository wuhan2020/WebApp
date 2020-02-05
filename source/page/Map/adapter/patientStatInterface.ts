export interface PatientStatData {
    confirmed: number;
    suspected: number;
    cured: number;
    dead: number;
}

export interface CountryOverviewData extends PatientStatData {
    name: string; // '中国'
    timestamp?: number; // integer, unit is 'ms', unix epoch time
}

export interface CountryData extends PatientStatData {
    name: string; // '中国'
    timestamp?: number; // integer, unit is 'ms', unix epoch time
    provinces?: { [name: string]: ProvinceData };
}

export interface ProvinceData extends PatientStatData {
    name: string; // '湖北'
    timestamp?: number;
    cities: { [name: string]: CityData };
}

export interface CityData extends PatientStatData {
    name: string; // '武汉'
    timestamp?: number;
}

export type Series<T extends CountryData | ProvinceData | CityData> = {
    [timestamp: number]: { [name: string]: T };
};

export interface OverallCountryData {
    provincesSeries: Series<ProvinceData>;
    countrySeries: Series<CountryOverviewData>;
}
