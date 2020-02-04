// 疫情数据接口
// NOTE 由于访问接口地址并不是和系统对应的接口是同一服务 所以单独起一个服务
import { request } from 'koajax';
const baseUri = 'http://wuhan2020.org.cn/data/map-viz';

type ValidType = 'overall' | 'current' | 'history';

export const getVirusMapData = async (type: ValidType = 'overall') => {
    const uri = `${baseUri}/${type}.json`;

    try {
        const response = await request({
            method: 'GET',
            path: uri,
            responseType: 'json'
        }).response;
        const { status, statusText, body } = response;
        if (status === 200) {
            return body;
        } else {
            throw new Error(`api return error! ${statusText}`);
        }
    } catch (e) {
        console.warn('error!!!', e);
        return null;
    }
};
