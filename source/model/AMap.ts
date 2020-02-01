const key = '8325164e247e15eea68b59e89200988b';

async function requestAMap<T = {}>(path: string, data: any): Promise<T> {
    const response = await fetch(
        `//restapi.amap.com/v3/${path}?${new URLSearchParams({ ...data, key })}`
    );
    const { status, info, ...rest } = await response.json();
    if (status !== '1') throw new URIError(info);
    return rest;
}

interface POI {
    name: string;
    pname: string;
    cityname: string;
    adname: string;
    address: string;
    location: string;
}

export async function searchAddress(keywords: string) {
    const { pois } = await requestAMap<{ pois: POI[] }>('place/text', {
        keywords
    });

    return pois.sort(({ name }) => (name === keywords ? -1 : 1));
}

interface District {
    adcode: string;
    name: string;
    level: string;
    center: string;
    districts: District[];
}

export async function getSubDistricts(keywords = '中国') {
    const {
        districts: [{ districts }]
    } = await requestAMap<District>('config/district', { keywords });

    return districts;
}
