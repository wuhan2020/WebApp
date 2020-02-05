const TimeUnit = [
    {
        scale: 1000,
        code: 's'
    },
    {
        scale: 60,
        code: 'm'
    },
    {
        scale: 60,
        code: 'H'
    },
    {
        scale: 24,
        code: 'D'
    },
    {
        scale: 7,
        code: 'W'
    },
    {
        scale: 30 / 7,
        code: 'M'
    },
    {
        scale: 12,
        code: 'Y'
    }
];

export function relativeTimeTo(date: number | string | Date) {
    let distance = +new Date(date) - +new Date(),
        unit = 'ms';

    for (const { scale, code } of TimeUnit) {
        const rest = distance / scale;

        if (Math.abs(rest) > 1) (distance = rest), (unit = code);
        else break;
    }

    return { distance: +distance.toFixed(0), unit };
}

export enum TimeUnitName {
    ms = '毫秒',
    s = '秒',
    m = '分钟',
    H = '小时',
    D = '日',
    W = '周',
    M = '月',
    Y = '年'
}

export function mergeList<T = {}>(key: keyof T, target: T[], ...source: T[][]) {
    for (const list of source) {
        const newData = [];

        for (const { [key]: id, ...rest } of list) {
            const item = target.find(({ [key]: ID }) => ID === id);

            if (item) Object.assign(item, rest);
            else newData.push({ [key]: id, ...rest });
        }

        target.push(...newData);
    }

    return target;
}

export function transform<T>(
    dataMap: { [key in keyof T]: string },
    source: { [key: string]: any }
) {
    type Data = { [key in keyof T]: any };

    const data: Data = {} as Data,
        map = Object.entries(dataMap);

    for (const key in source) {
        const [name] = map.find(item => key === item[1]) || [];

        if (name) data[name] = source[key];
    }

    return data;
}
