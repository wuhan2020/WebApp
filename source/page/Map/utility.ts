// 宽屏模式（通常是 PC）
export function isLandscape() {
    const { documentElement: html, body } = document;

    return (
        (self.innerWidth || html.clientWidth || body.clientWidth) >
        (self.innerHeight || html.clientHeight || body.clientHeight) * 0.8
    );
}

export function autoBreaks(values: number[]) {
    const base = [1, 10, 50, 100, 500, 1000];
    const k =
        (Math.floor(Math.max(...values.filter(v => v != null)) / 5 / 500) *
            500) /
        Math.max(...base);

    const res = base.map(b => k * b);
    res[0] = 1;
    return res;
}

const pair = (s: any[]) => s.slice(0, -1).map((item, i) => [item, s[i + 1]]);

export function createPieces(breaks: number[], palette) {
    return [
        { min: 0, max: 0, color: palette[0] },
        ...pair(breaks).map(([b1, b2], i) => ({
            gte: b1,
            lt: b2,
            color: palette[i + 1]
        })),
        { gte: breaks[breaks.length - 1], color: palette[breaks.length] }
    ];
}
