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

import { observer } from 'mobx-web-cell';
import { component, mixin, createCell, attribute, watch } from 'web-cell';

import { EchartsMap } from './EChartsMap';
import { VirusChart } from './VirusChart';
import { isLandscape } from '../../../utility';
import { PatientStatData, OverallCountryData } from '../adapter';

import MapUrls from '../data/province';

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
    chartPath?: Array<string>;
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

const pair = (s: any[]) =>
    s.slice(0, s.length - 1).map((item, i) => [item, s[i + 1]]);

function createPieces(breaks: number[], palette) {
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

@observer
@component({
    tagName: 'virus-map',
    renderTarget: 'children'
})
export class VirusMap extends mixin<Props, {}>() {
    @attribute
    @watch
    public name: string = '';

    @attribute
    @watch
    public data: MapDataType = {};

    @attribute
    @watch
    public breaks: number[] = [1, 10, 50, 100, 500, 1000];

    @attribute
    @watch
    public chartData = {};

    @attribute
    @watch
    public currentChartArea: string = '';

    @attribute
    @watch
    public chartPath: Array<string> = [];

    @attribute
    @watch
    public chartOnClickCallBack = (param, chart) => {
        console.log(param, chart);
    };

    public state = {
        mapScale: 1,
        chartArea: this.props.name
    };

    constructor() {
        super();
        this.chartAdjustLabel = this.chartAdjustLabel.bind(this);
        this.baseOptions = this.baseOptions.bind(this);
        this.getSTChartOptions = this.getSTChartOptions.bind(this);
        this.getChartOptions = this.getChartOptions.bind(this);
        this.overrides = this.overrides.bind(this);
    }

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
            /*
    formatter: (gt: number, lte: number) =>  {
      console.log(gt, lte);
      return lte === Infinity ? `> ${gt}` : lte > gt ? `(${gt}, ${lte}]` : `= ${lte}`}
    */
        };
    }

    private baseOptions(name: string, breaks: number[]) {
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
                    // roam: true,
                    zoom: 1,
                    label: {
                        show: true, //mapScale > 2.5,
                        fontSize: 10, //2 * mapScale
                        textBorderColor: '#FAFAFA',
                        textBorderWidth: 1
                    },
                    emphasis: {
                        label: {
                            show: true, //mapScale > 2.5,
                            fontSize: 10 //2 * mapScale
                        }
                    },
                    data: []
                }
            ]
        };
    }

    private overrides(data: MapDataType) {
        return {
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    if (params.componentType === 'timeline') {
                        if ((params.dataIndex % 24) * 3600000 === 0) {
                            return new Date(
                                params.dataIndex
                            ).toLocaleDateString('zh-CN');
                        } else {
                            return new Date(
                                params.dataIndex
                            ).toLocaleDateString('zh-CN-u-hc-h24');
                        }
                    }

                    const outputArray = [params.name];
                    if (data[params.name] === undefined) {
                        return params.name + '<br/>暂无数据';
                    }
                    if (data[params.name].confirmed !== undefined) {
                        outputArray.push(
                            '确诊：' + data[params.name].confirmed
                        );
                    }
                    if (data[params.name].suspected !== undefined) {
                        outputArray.push(
                            '疑似：' + data[params.name].suspected
                        );
                    }
                    if (data[params.name].cured !== undefined) {
                        outputArray.push('治愈：' + data[params.name].cured);
                    }
                    if (data[params.name].dead !== undefined) {
                        outputArray.push('死亡：' + data[params.name].dead);
                    }
                    return outputArray.join('<br/>');
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
    }

    public chartAdjustLabel(param: any, chart: any): void {
        const isForceRatio = 0.75;
        const isAdjustLabel = true;
        let options = this.baseOptions(this.props.name, this.props.breaks);
        if (chart && options) {
            const domWidth = chart.getWidth();
            const domHeight = chart.getHeight();
            if (isForceRatio) {
                const maxWidth = Math.min(domWidth, domHeight / isForceRatio);
                const maxHeight = Math.min(domHeight, maxWidth * isForceRatio);
                // move the item MUCH closer

                //if (domHeight > domWidth) {
                //options.visualMap[0].show = false;
                /*
          options.visualMap[0].orient = 'horizontal';
          options.visualMap[0].right = undefined;
          options.visualMap[0].top = Math.max(
            domHeight / 2 - maxHeight / 2 - 50,
            0
          );
          options.visualMap[0].bottom = undefined;
          options.visualMap[0].left = 'center';
          */
                //} else if (domHeight > domWidth * isForceRatio) {
                const visualMap = {
                    ...options.visualMap[0],
                    ...this.genBasicVisualMap()
                };
                if (domHeight > domWidth * isForceRatio) {
                    options.visualMap[0].left = 0 as any; //'20px';
                    //options.visualMap[0].right = 0 as any;
                    //options.visualMap[0].bottom = undefined;
                    options.visualMap[0].top = '50px';
                } else {
                    //options.visualMap[0].top = 0 as any; //'50px';
                    options.visualMap[0].left = '20px';
                }
            }
            const scale = param ? param.scale : 1;

            if (isAdjustLabel && scale && isForceRatio) {
                const maxWidth = Math.min(domWidth, domHeight / isForceRatio);
                const maxHeight = Math.min(domHeight, maxWidth * isForceRatio);
                options.series.forEach(s => (s.zoom *= scale));
                const size = options.series[0].zoom * maxHeight;
                if (size < 300) {
                    //options.visualMap[0].show = false;
                    options.series.forEach(s => (s.label.show = false));
                } else {
                    //options.visualMap[0].show = true;
                    options.series.forEach(s => (s.label.show = true));
                }
            }
            if (this.isTimelineData(this.props.data)) {
                options = this.getSTChartOptions(
                    this.props.data as STMapDataType,
                    options
                ) as any;
            } else {
                options = this.getChartOptions(
                    this.props.data as MapDataType,
                    options
                ) as any;
            }
            chart.setOption(options);
        }
    }

    public getChartOptions(data: MapDataType, options: any = null) {
        if (!options) {
            options = this.baseOptions(this.props.name, this.props.breaks);
        }
        let extra = this.overrides(data);
        options.series[0].data = extra.series[0].data;
        options.tooltip = extra.tooltip;
        return options;
    }
    public getSTChartOptions(data: STMapDataType, options: any = null) {
        if (!options) {
            options = this.baseOptions(this.props.name, this.props.breaks);
        }
        options['timeline'] = {
            axisType: 'time',
            show: true,
            tooltip: {},
            // autoPlay: true,
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
                        .substring(5); // year is not necessary, standardize to ISO
                }
            }
        };
        return {
            baseOption: options,
            options: data.timeline.sort().map(t => this.overrides(data.data[t]))
        };
    }
    private isTimelineData(data: MapDataType | STMapDataType): boolean {
        return (data as STMapDataType).timeline !== undefined;
    }

    public render({
        name,
        data,
        chartOnClickCallBack,
        currentChartArea,
        chartData,
        chartPath
    }: Props) {
        // 缩放时间重新set一下option
        const pcStyle = {
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            height: '100%'
        };
        const mobileStyle = {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%'
        };
        const isPC = isLandscape();
        const containerStyle = isPC ? pcStyle : mobileStyle;
        const mapStyle = {
            width: isPC ? '65%' : '100%',
            height: '100%'
        };
        const virusChartStyle = {
            width: isPC ? '35%' : '100%',
            height: '100%'
        };

        return (
            <div style={containerStyle}>
                <EchartsMap
                    style={mapStyle}
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
                    style={virusChartStyle}
                    data={chartData}
                    area={currentChartArea}
                    path={chartPath}
                />
            </div>
        );
    }
}
