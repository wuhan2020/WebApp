import { observable } from 'mobx';
import service, { DataItem, User, PageData } from './HTTPService';
// import { Contact } from './SuppliesRequirement';

const mockData = [
    {
        name: '京东健康',
        phones: '问诊热线 010-89128261 或 010-89128263',
        url: 'https://mp.weixin.qq.com/s/xVuqfWdQJ0INbgBYxxdJGw',
        notes: '免费问诊，每天8:00-20:00之间'
    },
    {
        name: '丁香医生',
        phones: '扫描二维码进入小程序',
        url:
            'https://ask.dxy.com/ama/index#/activity-share?activity_id=111&dxa_adplatform=yqdtyz',
        notes: '新型冠状肺炎问题湖北用户免费'
    },
    {
        name: '妙手医生',
        phones: '网页内提交病情描述',
        url:
            'https://m.miaoshou.net/wuhanfeiyan0122.html?from=singlemessage&isappinstalled=0',
        notes: '免费问诊'
    },
    {
        name: '武汉协和医院',
        phones:
            '关注“武汉协和医院”公众号，点击："就医服务“——”在线问诊“——“发热门诊”——“马上问诊”',
        url: 'https://mp.weixin.qq.com/s/74F6GFPSFVUr-GhYDcKMKw',
        notes: '24小时免费问诊，需要耐心等待医生回复'
    },
    {
        name: '成都华西医院',
        phones: '咨询电话028-85422114 网络问诊：扫码进入华西医院抗冠专区',
        url: 'https://mp.weixin.qq.com/s/9KIjqOv5-HuZeaia43J4ug',
        notes: '疫情专项免费心理干预咨询电话和网络问诊'
    }
];

export interface FreeClinic extends DataItem {
    // clinic?: string;
    // address?: string;
    // coords?: number[];
    // supplies?: string[];
    // contacts?: Contact[];
    // creator?: User;
    name: string;
    url: string;
    notes: string;
    phones: string[];
}

export class FreeClinicModel {
    @observable
    pageIndex = 0;

    pageSize = 10;

    totalCount = 0;

    @observable
    list = [];

    async getNextPage() {
        // if (this.pageIndex && this.list.length === this.totalCount) return;

        // const {
        //     body: { count, data }
        // } = await service.get<PageData<SuppliesRequirement>>(
        //     '/supplies/requirement?' +
        //         new URLSearchParams({
        //             pageIndex: this.pageIndex + 1 + '',
        //             pageSize: this.pageSize + ''
        //         })
        // );
        // this.pageIndex++, (this.totalCount = count);

        // this.list = this.list.concat(data);

        // return data;

        this.list = mockData;
        return mockData;
    }

    // async update(data: FreeClinic, id?: string) {
    //     if (!id) {
    //         const { body } = await service.post<FreeClinic>(
    //             '/supplies/requirement',
    //             data
    //         );

    //         this.list = [body].concat(this.list);
    //     } else {
    //         const { body } = await service.put<FreeClinic>(
    //                 '/supplies/requirement/' + id,
    //                 data
    //             ),
    //             index = this.list.findIndex(({ objectId }) => objectId === id);

    //         this.list[index] = body;
    //     }
    // }

    // async getOne(id: string) {
    //     const { body } = await service.get<FreeClinic>(
    //         '/supplies/requirement/' + id
    //     );
    //     return body;
    // }

    async delete(id: string) {
        await service.delete('/supplies/requirement/' + id);

        this.list = this.list.filter(({ objectId }) => objectId !== id);
    }
}
