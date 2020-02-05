/* eslint-disable no-unused-vars */
/**
 * WebCell疫情地图组件
 * 基于EchartsMap组件构建的疫情地图组件，传入地图url及各区域的具体信息后自动生成疫情地图。
 * @author: shadowingszy, yarray
 *
 * 传入props说明:
 * name: 地图对应的行政区划（简写）
 * data: 显示在地图中的疫情数据。
 * chartOnClickCallBack: 点击地图后的回调函数。
 */
import {
    component,
    mixin,
    createCell,
    attribute,
    watch,
    Fragment
} from 'web-cell';
import { observer } from 'mobx-web-cell';

import { EChartsMap } from './EChartsMap';
import { VirusChart } from './VirusChart';
import { PatientStatData, OverallCountryData } from '../adapter';

import { createPieces } from '../utility';
import MapUrls from '../data/province';
import style from './VirusMap.module.css';

export type MapDataType = { [name: string]: PatientStatData };

export type STMapDataType = {
    timeline: number[];
    data: { [timestamp: number]: MapDataType };
}; // spatio-temporal data

interface Props {
    name: string;
    data?: MapDataType | STMapDataType;
    breaks?: number[];
    chartData?: OverallCountryData;
    chartPath?: string[];
    currentChartArea: string;
    chartOnClickCallBack?: Function;
}

function mapName(name: string) {
    return name === '中国' ? 'china' : 'map';
}

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

@observer
@component({
    tagName: 'virus-map',
    renderTarget: 'children'
})
export class VirusMap extends mixin<Props, {}>() {
    @attribute
    @watch
    name: string = '';

    @watch
    data: MapDataType = {};

    @attribute
    @watch
    breaks: number[] = [1, 10, 50, 100, 500, 1000];

    @watch
    chartData = {};

    @attribute
    @watch
    currentChartArea: string = '';

    @attribute
    @watch
    chartPath: string[] = [];

    @watch
    chartOnClickCallBack = (param, chart) => {
        console.log(param, chart);
    };

    state = {
        mapScale: 1,
        chartArea: this.props.name
    };

    private genBasicVisualMap() {
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
        const visualMap = {
            ...this.genBasicVisualMap(),
            ...pieceDict
        };

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

    private overrides = (data: MapDataType) => {
        return {
            tooltip: {
                trigger: 'item',
                formatter: ({ componentType, dataIndex, name }) => {
                    if (componentType === 'timeline')
                        return new Date(dataIndex).toLocaleDateString(
                            (dataIndex % 24) * 3600000 === 0
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
        };
    };

    chartAdjustLabel = (param: any, chart: any) => {
        const isForceRatio = 0.75,
            isAdjustLabel = true,
            domWidth = chart.getWidth(),
            domHeight = chart.getHeight();

        let options = this.baseOptions(this.props.name, this.props.breaks);

        if (isForceRatio)
            if (domHeight > domWidth * isForceRatio)
                (options.visualMap[0].left = '0'),
                    (options.visualMap[0].top = '50px');
            else options.visualMap[0].left = '20px';

        const scale = param ? param.scale : 1;

        if (isAdjustLabel && scale && isForceRatio) {
            const maxWidth = Math.min(domWidth, domHeight / isForceRatio);
            const maxHeight = Math.min(domHeight, maxWidth * isForceRatio);

            for (const s of options.series) s.zoom *= scale;

            const show = options.series[0].zoom * maxHeight >= 300;

            for (const s of options.series) s.label.show = show;
        }

        options = this.isTimelineData(this.props.data)
            ? (this.getSTChartOptions(
                  this.props.data as STMapDataType,
                  options
              ) as any)
            : (this.getChartOptions(
                  this.props.data as MapDataType,
                  options
              ) as any);

        chart.setOption(options);
    };

    getChartOptions = (data: MapDataType, options?: any) => {
        options =
            options || this.baseOptions(this.props.name, this.props.breaks);

        const extra = this.overrides(data);

        options.series[0].data = extra.series[0].data;
        options.tooltip = extra.tooltip;

        return options;
    };

    getSTChartOptions = (data: STMapDataType, options?: any) => {
        options =
            options || this.baseOptions(this.props.name, this.props.breaks);

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
                formatter: function(s) {
                    return new Date(parseInt(s, 10))
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

    private isTimelineData(data: MapDataType | STMapDataType): boolean {
        return (data as STMapDataType).timeline !== undefined;
    }

    connectedCallback() {
        this.classList.add(style.box);

        super.connectedCallback();
    }

    render({
        name,
        data,
        chartOnClickCallBack,
        currentChartArea,
        chartData,
        chartPath
    }: Props) {
        return (
            <Fragment>
                <EChartsMap
                    className={style.map}
                    mapUrl={MapUrls[name]}
                    mapName={mapName(name)}
                    chartOptions={
                        this.isTimelineData(data)
                            ? this.getSTChartOptions(data as STMapDataType)
                            : this.getChartOptions(data as MapDataType)
                    }
                    chartAdjustLabel={this.chartAdjustLabel}
                    chartOnClickCallBack={chartOnClickCallBack}
                />
                <VirusChart
                    className={style.chart}
                    data={chartData}
                    area={currentChartArea}
                    path={chartPath}
                />
            </Fragment>
        );
    }
}
