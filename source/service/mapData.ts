// 疫情数据调用封装
// NOTE: 访问接口地址并不是和系统对应的接口是同一服务
import { request } from 'koajax';

// @credit: https://lab.ahusmart.com/nCoV/api/ 提供了丁香园的疫情数据
// @credit: https://lab.isaaclin.cn/nCoV/ 同样提供了丁香园的疫情数据
const baseUri = 'https://lab.ahusmart.com/nCoV/api'; // use HTTPS to prevent CORS issues
const uriMap = {
    overall: 'overall?latest=0',
    history: 'area?latest=0',
    current: 'area'
};

type ValidType = 'overall' | 'current' | 'history';

export const getVirusMapData = async (type: ValidType = 'overall') => {
    const uri = `${baseUri}/${uriMap[type]}`;

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
