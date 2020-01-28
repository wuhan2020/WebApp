import service from './HTTPService';
let mock = [
    {
        organization: '北京校友会',
        website: 'https://mp.weixin.qq.com/s/dXed5MIYgBisrV_pfQmV0w', //官方网址
        bankName: '中国民生银行北京工体北路支行', //开户行
        accountNo: '6216 9101 0452 6790', //银行账号
        accountName: '宋扬', //户名
        contacts: [
            {
                name: '刘稷轩',
                phone: '18618365405'
            }
        ], //联系人（姓名、电话）
        comments:
            '北京校友会衷心地感谢大家的慷慨解囊和无私帮助，我们再次向参与支援武汉的校友和社会爱心人士表示最诚挚的感谢！祝愿大家在鼠年身体健康，阖家幸福！' //备注
    }
];
export class DonationService {
    constructor() {}
    async getResultPage() {
        // const {
        //     body: { count, mock }
        // } = await service.get("")
        return { result: mock };
    }

    async update(data: any, id?: string) {
        const { body } = await service.post(' ', data);
        return body;
    }

    async delete(id: string) {
        await service.delete('', id);
    }
}
