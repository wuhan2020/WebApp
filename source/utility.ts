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
    m = '分',
    H = '小时',
    D = '日',
    W = '周',
    M = '月',
    Y = '年'
}
