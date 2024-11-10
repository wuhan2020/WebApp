import { HTTPClient, HTTPError } from 'koajax';
import { buildURLData, parseURLData } from 'web-utility';

import { Area, dataVClient, DistrictResponse } from '../model/Area';

const key = '8325164e247e15eea68b59e89200988b';

type AMapError = Record<
    'status' | `info${'' | 'code'}` | 'key' | `sec_code${'' | '_debug'}`,
    string
>;

const amapClient = new HTTPClient({
    baseURI: 'https://restapi.amap.com/v3/',
    responseType: 'json'
}).use(async ({ request, response }, next) => {
    const [path, search] = (request.path + '').split('?');

    request.path = `${path}?${buildURLData({ ...parseURLData(search), key })}`;

    await next();

    const { status, info, ...rest } = response.body as AMapError;

    if (status !== '1') throw new HTTPError(info, request, response);

    response.body = rest;
});

type POI = Record<
    `${'' | 'p' | 'city' | 'ad'}name` | 'address' | 'location',
    string
>;

export async function searchAddress(keywords: string) {
    const { body } = await amapClient.get<{ pois: POI[] }>(
        `place/text?${buildURLData({ keywords })}`
    );
    return body!.pois.sort(({ name }) => (name === keywords ? -1 : 1));
}

export interface District
    extends Record<'adcode' | 'name' | 'level' | 'center', string> {
    districts: District[];
}

export async function getSubDistricts(
    parent = '100000',
    maxLevel: Area['level'] = 'province'
) {
    const { body } = await dataVClient.get<DistrictResponse>(
        `${parent}_full.json`
    );
    const districts = body.features.map(
        async ({ properties: { adcode, name, level, center } }) =>
            level &&
            ({
                adcode,
                name,
                level,
                center: center + '',
                districts:
                    level === maxLevel
                        ? []
                        : await getSubDistricts(adcode + '', maxLevel)
            } as District)
    );
    return (await Promise.all(districts)).filter(Boolean) as District[];
}

export type GeoCode = Record<
    'location' | 'province' | 'city' | 'district' | 'street' | 'number',
    string
>;

export async function coordsOf(address: string) {
    const { body } = await amapClient.get<{ geocodes: GeoCode[] }>(
        `geocode/geo?${buildURLData({ address })}`
    );

    return body!.geocodes.map(({ location, street, number, ...rest }) => {
        const [longitude, latitude] = location.split(',').map(Number);

        return { latitude, longitude, ...rest, address: street + number };
    });
}
