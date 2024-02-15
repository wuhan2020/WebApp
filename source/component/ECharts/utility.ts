import { use } from 'echarts/core';

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

export async function loadComponent(name: ECComponentOptionName) {
    const componentName = BUITIN_COMPONENTS_MAP[name];
    const { [componentName]: component } = await import('echarts/components');

    use(component);
}

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

export async function loadChart(name: keyof typeof BUILTIN_CHARTS_MAP) {
    const chartName = BUILTIN_CHARTS_MAP[name];
    const { [chartName]: chart } = await import('echarts/charts');

    use(chart);
}

export type ChartType = 'svg' | 'canvas';

export async function loadRenderer(type: ChartType) {
    const { SVGRenderer, CanvasRenderer } = await import('echarts/renderers');

    use(type === 'svg' ? SVGRenderer : CanvasRenderer);
}
