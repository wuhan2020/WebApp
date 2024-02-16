import { use } from 'echarts/core';
import memoize from 'lodash.memoize';
import { IndexKey } from 'web-utility';

export function proxyPrototype<T extends object>(
    target: T,
    dataStore: Record<IndexKey, any>,
    setter?: (key: IndexKey, value: any) => any
) {
    const prototype = Object.getPrototypeOf(target);

    const prototypeProxy = new Proxy(prototype, {
        set: (_, key, value, receiver) => {
            if (key in receiver) Reflect.set(prototype, key, value, receiver);
            else dataStore[key] = value;

            setter?.(key, value);

            return true;
        },
        get: (prototype, key, receiver) =>
            key in dataStore
                ? dataStore[key]
                : Reflect.get(prototype, key, receiver)
    });

    Object.setPrototypeOf(target, prototypeProxy);
}

/**
 * @see {@link https://github.com/apache/echarts/blob/031a908fafaa57e2277b2f720087195925ec38cf/src/model/Global.ts#L83-L111}
 */
export const BUITIN_COMPONENTS_MAP = {
    grid: 'GridComponent',
    polar: 'PolarComponent',
    geo: 'GeoComponent',
    singleAxis: 'SingleAxisComponent',
    parallel: 'ParallelComponent',
    calendar: 'CalendarComponent',
    graphic: 'GraphicComponent',
    toolbox: 'ToolboxComponent',
    tooltip: 'TooltipComponent',
    axisPointer: 'AxisPointerComponent',
    brush: 'BrushComponent',
    title: 'TitleComponent',
    timeline: 'TimelineComponent',
    markPoint: 'MarkPointComponent',
    markLine: 'MarkLineComponent',
    markArea: 'MarkAreaComponent',
    legend: 'LegendComponent',
    dataZoom: 'DataZoomComponent',
    visualMap: 'VisualMapComponent',
    // aria: 'AriaComponent',
    // dataset: 'DatasetComponent',

    // Dependencies
    xAxis: 'GridComponent',
    yAxis: 'GridComponent',
    angleAxis: 'PolarComponent',
    radiusAxis: 'PolarComponent'
} as const;

export type ECComponentOptionName = keyof typeof BUITIN_COMPONENTS_MAP;

export const loadComponent = memoize(async (name: ECComponentOptionName) => {
    const componentName = BUITIN_COMPONENTS_MAP[name];
    const { [componentName]: component } = await import('echarts/components');

    use(component);
});

/**
 * @see {@link https://github.com/apache/echarts/blob/031a908fafaa57e2277b2f720087195925ec38cf/src/model/Global.ts#L113-L136}
 */
export const BUILTIN_CHARTS_MAP = {
    line: 'LineChart',
    bar: 'BarChart',
    pie: 'PieChart',
    scatter: 'ScatterChart',
    radar: 'RadarChart',
    map: 'MapChart',
    tree: 'TreeChart',
    treemap: 'TreemapChart',
    graph: 'GraphChart',
    gauge: 'GaugeChart',
    funnel: 'FunnelChart',
    parallel: 'ParallelChart',
    sankey: 'SankeyChart',
    boxplot: 'BoxplotChart',
    candlestick: 'CandlestickChart',
    effectScatter: 'EffectScatterChart',
    lines: 'LinesChart',
    heatmap: 'HeatmapChart',
    pictorialBar: 'PictorialBarChart',
    themeRiver: 'ThemeRiverChart',
    sunburst: 'SunburstChart',
    custom: 'CustomChart'
} as const;

export type ECChartOptionName = keyof typeof BUILTIN_CHARTS_MAP;

export const loadChart = memoize(async (name: ECChartOptionName) => {
    const chartName = BUILTIN_CHARTS_MAP[name];
    const { [chartName]: chart } = await import('echarts/charts');

    use(chart);
});

export type ChartType = 'svg' | 'canvas';

export const loadRenderer = memoize(async (type: ChartType) => {
    const { SVGRenderer, CanvasRenderer } = await import('echarts/renderers');

    use(type === 'svg' ? SVGRenderer : CanvasRenderer);
});
