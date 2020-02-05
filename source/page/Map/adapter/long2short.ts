// convert long city name to short
const nations = [
    '仫佬族',
    '黎族',
    '土家族',
    '蒙古族',
    '羌族',
    '僳僳族',
    '哈尼族',
    '回族',
    '布朗族',
    '佤族',
    '哈萨克族',
    '藏族',
    '撒拉族',
    '畲族',
    '傣族',
    '维吾尔族',
    '毛南族',
    '高山族',
    '德昂族',
    '苗族',
    '仡佬族',
    '拉祜族',
    '保安族',
    '彝族',
    '锡伯族',
    '水族',
    '裕固族',
    '壮族',
    '阿昌族',
    '东乡族',
    '京族',
    '布依族',
    '普米族',
    '纳西族',
    '独龙族',
    '朝鲜族',
    '塔吉克族',
    '景颇族',
    '鄂伦春族',
    '满族',
    '怒族',
    '柯尔克孜族',
    '赫哲族',
    '侗族',
    '乌孜别克族',
    '土族',
    '门巴族',
    '瑶族',
    '俄罗斯族',
    '达斡尔族',
    '珞巴族',
    '白族',
    '鄂温克族',
    '塔塔尔族',
    '基诺族 '
];

export function long2short(name: string) {
    const nation = nations.find(nation => name.includes(nation));

    name = name.replace(nation, '').replace('自治', '');

    if (name.endsWith('林区')) return name;

    if (name.endsWith('区') || name.endsWith('市')) return name.slice(0, -1);

    return name;
}
