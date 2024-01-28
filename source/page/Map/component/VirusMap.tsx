import { WebCell, component, attribute, observer } from 'web-cell';
import { observable } from 'mobx';
import { Hour } from 'web-utility';

import { EChartsMapProps, EChartsMap } from './EChartsMap';
import { VirusChart } from './VirusChart';
import { PatientStatData, OverallCountryData } from '../adapter';

import { createPieces } from '../utility';
import MapUrls from '../data/province';
import style from './VirusMap.module.css';

export type MapDataType = Record<string, PatientStatData>;

/**
 * spatio-temporal data
 */
export type STMapDataType = {
    timeline: number[];
    data: Record<number, MapDataType>;
};

export interface VirusMapProps extends Pick<EChartsMapProps, 'onSeriesClick'> {
    /**
     * 地图对应的行政区划（简写）
     */
    name: string;
    /**
     * 显示在地图中的疫情数据
     */
    data?: MapDataType | STMapDataType;
    breaks?: number[];
    chartData?: OverallCountryData;
    chartPath?: string[];
    currentChartArea: string;
}

const mapName = (name: string) => (name === '中国' ? 'china' : 'map');

const PALETTE = [
    '#FFFFFF',
    '#FFFADD',
    '#FFDC90',
    '#FFA060',
    '#DD6C5C',
    '#AC2F13',
    '#3E130E'
];

enum PatientType {
    confirmed = '确诊',
    suspected = '疑似',
    cured = '治愈',
    dead = '死亡'
}

export interface VirusMap extends WebCell<VirusMapProps> {}

/**
 * WebCell 疫情地图组件
 *
 * 基于 {@link EchartsMap} 组件构建的疫情地图组件，
 * 传入地图 URL 及各区域的具体信息后自动生成疫情地图。
 *
 * @author shadowingszy, yarray
 */
@component({ tagName: 'virus-map' })
@observer
export class VirusMap extends HTMLElement implements WebCell<VirusMapProps> {
    @attribute
    @observable
    accessor name = '';

    @observable
    accessor data: VirusMapProps['data'] = {};

    @attribute
    @observable
    accessor breaks = [1, 10, 50, 100, 500, 1000];

    @observable
    accessor chartData = {} as VirusChart['data'];

    @attribute
    @observable
    accessor currentChartArea = '';

    @attribute
    @observable
    accessor chartPath: string[] = [];

    @observable
    accessor state = {
        mapScale: 1,
        chartArea: this.name
    };

    get basicVisualMap() {
        return {
            show: true,
            type: 'piecewise',
            left: '20px',
            right: undefined,
            top: '50px',
            bottom: undefined,
            orient: 'vertical',
            itemHeight: 10,
            itemWidth: 14,
            itemGap: 10,
            itemSymbol: 'circle',
            backgroundColor: 'rgba(200,200,200, 0.2)',
            padding: 10,
            textStyle: {
                fontSize: 10
            }
        };
    }

    private baseOptions = (name: string, breaks: number[]) => {
        const pieceDict = { pieces: createPieces(breaks, PALETTE) };
        const visualMap = { ...this.basicVisualMap, ...pieceDict };

        return {
            title: {
                text: name + '疫情地图', // workaround for incomplete map data
                left: '20px',
                top: '20px'
            },
            tooltip: {},
            visualMap: [visualMap],
            series: [
                {
                    name: '疫情数据',
                    type: 'map',
                    map: mapName(name),
                    mapType: 'map',
                    zoom: 1,
                    label: {
                        show: true,
                        fontSize: 10,
                        textBorderColor: '#FAFAFA',
                        textBorderWidth: 1
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 10
                        }
                    },
                    data: []
                }
            ]
        };
    };

    private overrides = (data: MapDataType) => ({
        tooltip: {
            trigger: 'item',
            formatter: ({ componentType, dataIndex, name }) => {
                if (componentType === 'timeline')
                    return new Date(dataIndex).toLocaleDateString(
                        (dataIndex % 24) * Hour === 0
                            ? 'zh-CN'
                            : 'zh-CN-u-hc-h24'
                    );

                const outputArray = [name];

                if (!data[name]) return name + '<br />暂无数据';

                for (const key in PatientType)
                    if (data[name][key] != null)
                        outputArray.push(
                            PatientType[key] + '：' + data[name][key]
                        );

                return outputArray.join('<br />');
            }
        },
        series: [
            {
                data: Object.keys(data).map(name => ({
                    name,
                    value: data[name].confirmed || 0
                }))
            }
        ]
    });

    handleChartLabelAdjust: EChartsMapProps['onChartLabelAdjust'] = ({
        detail: chart
    }) => {
        const isForceRatio = 0.75,
            isAdjustLabel = true,
            domWidth = chart.getWidth(),
            domHeight = chart.getHeight();

        let options = this.baseOptions(this.name, this.breaks);

        if (isForceRatio)
            if (domHeight > domWidth * isForceRatio)
                (options.visualMap[0].left = '0'),
                    (options.visualMap[0].top = '50px');
            else options.visualMap[0].left = '20px';

        const scale = 1;

        if (isAdjustLabel && scale && isForceRatio) {
            const maxWidth = Math.min(domWidth, domHeight / isForceRatio);
            const maxHeight = Math.min(domHeight, maxWidth * isForceRatio);

            for (const s of options.series) s.zoom *= scale;

            const show = options.series[0].zoom * maxHeight >= 300;

            for (const s of options.series) s.label.show = show;
        }

        options = this.isTimelineData(this.data)
            ? (this.getSTChartOptions(
                  this.data as STMapDataType,
                  options
              ) as any)
            : (this.getChartOptions(this.data as MapDataType, options) as any);

        chart.setOption(options);
    };

    getChartOptions = (data: MapDataType, options?: any) => {
        options ||= this.baseOptions(this.name, this.breaks);

        const extra = this.overrides(data);

        options.series[0].data = extra.series[0].data;
        options.tooltip = extra.tooltip;

        return options;
    };

    getSTChartOptions = (data: STMapDataType, options?: any) => {
        options ||= this.baseOptions(this.name, this.breaks);

        options['timeline'] = {
            axisType: 'time',
            show: true,
            tooltip: {},
            playInterval: 1500,
            currentIndex: data.timeline.length - 1,
            data: data.timeline,
            left: 'left',
            right: 0,
            label: {
                fontSize: 10,
                position: 10,
                rotate: 45,
                textStyle: {
                    align: 'right',
                    baseline: 'middle'
                },
                formatter(time: string) {
                    return new Date(parseInt(time, 10))
                        .toLocaleDateString('zh-CN')
                        .slice(5); // year is not necessary, standardize to ISO
                }
            }
        };
        return {
            baseOption: options,
            options: data.timeline.sort().map(t => this.overrides(data.data[t]))
        };
    };

    private isTimelineData(data: MapDataType | STMapDataType) {
        return (data as STMapDataType).timeline != null;
    }

    connectedCallback() {
        this.classList.add(style.box);
    }

    render() {
        const { name, data, currentChartArea, chartData, chartPath } = this;

        return (
            <>
                <EChartsMap
                    className={style.map}
                    mapUrl={MapUrls[name]}
                    mapName={mapName(name)}
                    chartOptions={
                        this.isTimelineData(data)
                            ? this.getSTChartOptions(data as STMapDataType)
                            : this.getChartOptions(data as MapDataType)
                    }
                    onChartLabelAdjust={this.handleChartLabelAdjust}
                />
                <VirusChart
                    className={style.chart}
                    data={chartData}
                    area={currentChartArea}
                    path={chartPath}
                />
            </>
        );
    }
}
