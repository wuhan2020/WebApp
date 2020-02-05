/* eslint-disable no-unused-vars */
/**
 * WebCell 疫情数据折线图可视化组件
 * 本组件使用stack line chart和line chart展现信息
 * @author: shadowingszy
 *
 * 传入props说明:
 * data: 各省市或国家数据。
 * area: 当前选中的国家或省市。
 */

import { observer } from 'mobx-web-cell';
import { component, mixin, createCell, watch, attribute } from 'web-cell';

import { WebCellECharts } from './WebCellEcharts';
import { isLandscape } from '../../../utility';
import {
    Series,
    ProvinceData,
    CountryData,
    CountryOverviewData,
    OverallCountryData
} from '../adapter';
import { area as areaModel } from '../../../model';

interface Props {
    data: OverallCountryData;
    area: string;
    path: Array<string>;
}

interface State {
    echartOptions: any;
}

const LINE_WIDTH = 5;
const SYMOBL_SIZE = 10;

@observer
@component({
    tagName: 'virus-line-charts',
    renderTarget: 'children'
})
export class VirusChart extends mixin<Props, State>() {
    @attribute
    @watch
    public data: OverallCountryData = {
        provincesSeries: {},
        countrySeries: {}
    };

    @attribute
    @watch
    public area: string = '';

    @attribute
    @watch
    public path: Array<string> = [];

    public getOrderedTimeData(
        data: CountryData | Series<ProvinceData> | Series<CountryOverviewData>
    ) {
        let output = [];
        for (const property in data) {
            data[property].date = parseInt(property);
            output.push(data[property]);
        }
        output.sort((a, b) => {
            return a.date - b.date;
        });
        return output;
    }

    public fixChartFontSize(baseFontSize: number) {
        const isPC = isLandscape();
        if (isPC) {
            return (
                (baseFontSize *
                    (window.innerWidth ||
                        document.documentElement.clientWidth ||
                        document.body.clientWidth)) /
                1000
            );
        } else {
            return (
                (baseFontSize *
                    (window.innerWidth ||
                        document.documentElement.clientWidth ||
                        document.body.clientWidth)) /
                500
            );
        }
    }

    public getData(
        orderedProvinceData: Array<any>,
        orderedOverviewData: Array<any>,
        area: string,
        path: Array<string>
    ) {
        let confirmedData = [];
        let suspectedData = [];
        let curedData = [];
        let deadData = [];

        if (path.length === 0 && area === '中国') {
            for (const item of orderedOverviewData) {
                confirmedData.push([item.date, item.confirmedCount]);
                suspectedData.push([item.date, item.suspectedCount]);
                curedData.push([item.date, item.curedCount]);
                deadData.push([item.date, item.deadCount]);
            }
        } else if (path.length === 1) {
            if (areaModel.provinces.find(({ name }) => name.startsWith(area)))
                for (const item of orderedProvinceData) {
                    confirmedData.push([
                        item.date,
                        item[area] ? item[area].confirmed : 0
                    ]);
                    suspectedData.push([
                        item.date,
                        item[area] ? item[area].suspected : 0
                    ]);
                    curedData.push([
                        item.date,
                        item[area] ? item[area].cured : 0
                    ]);
                    deadData.push([
                        item.date,
                        item[area] ? item[area].dead : 0
                    ]);
                }
            else {
                for (const item of orderedProvinceData) {
                    confirmedData.push([
                        item.date,
                        item[path[0]]
                            ? item[path[0]].cities[area]
                                ? item[path[0]].cities[area].confirmed
                                : 0
                            : 0
                    ]);
                    suspectedData.push([
                        item.date,
                        item[path[0]]
                            ? item[path[0]].cities[area]
                                ? item[path[0]].cities[area].suspected
                                : 0
                            : 0
                    ]);
                    curedData.push([
                        item.date,
                        item[path[0]]
                            ? item[path[0]].cities[area]
                                ? item[path[0]].cities[area].cured
                                : 0
                            : 0
                    ]);
                    deadData.push([
                        item.date,
                        item[path[0]]
                            ? item[path[0]].cities[area]
                                ? item[path[0]].cities[area].dead
                                : 0
                            : 0
                    ]);
                }
            }
        }

        return {
            confirmedData,
            suspectedData,
            curedData,
            deadData
        };
    }

    public getConfirmedSuspectChartOptions(
        orderedProvinceData: Array<any>,
        orderedOverviewData: Array<any>,
        area: string,
        path: Array<string>
    ) {
        const { confirmedData, suspectedData } = this.getData(
            orderedProvinceData,
            orderedOverviewData,
            area,
            path
        );

        return {
            legend: {
                orient: 'horizontal',
                bottom: '13%',
                data: ['确诊', '疑似']
            },
            title: {
                text: area + '确诊/疑似患者人数',
                top: '5%',
                x: 'center'
            },
            grid: {
                bottom: '25%'
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                name: '日期',
                type: 'time',
                nameTextStyle: {
                    fontSize: this.fixChartFontSize(9)
                },
                nameGap: 5,
                axisLabel: {
                    textStyle: {
                        fontSize: this.fixChartFontSize(7)
                    },
                    formatter: function(params) {
                        const date = new Date(params);
                        return date.getMonth() + 1 + '/' + date.getDate();
                    }
                }
            },
            yAxis: {
                name: '人数',
                nameTextStyle: {
                    fontSize: this.fixChartFontSize(9)
                },
                nameGap: 10,
                axisLabel: {
                    textStyle: {
                        fontSize: this.fixChartFontSize(7)
                    }
                }
            },
            series: [
                {
                    name: '确诊',
                    data: confirmedData,
                    type: 'line',
                    stack: '总量',
                    symbolSize: SYMOBL_SIZE,
                    lineStyle: { width: LINE_WIDTH },
                    areaStyle: { color: '#f6bdcd' }
                },
                {
                    name: '疑似',
                    data: suspectedData,
                    type: 'line',
                    stack: '总量',
                    symbolSize: SYMOBL_SIZE,
                    lineStyle: { width: LINE_WIDTH },
                    areaStyle: { color: '#f9e4ba' }
                }
            ],
            color: ['#c22b49', '#cca42d']
        };
    }

    public getCuredDeadChartOptions(
        orderedProvinceData: Array<any>,
        orderedOverviewData: Array<any>,
        area: string,
        path: Array<string>
    ) {
        const { curedData, deadData } = this.getData(
            orderedProvinceData,
            orderedOverviewData,
            area,
            path
        );

        return {
            tooltip: {
                trigger: 'axis'
            },
            title: {
                text: area + '治愈/死亡患者人数',
                top: '5%',
                x: 'center'
            },
            grid: {
                bottom: '25%'
            },
            xAxis: {
                name: '日期',
                type: 'time',
                nameTextStyle: {
                    fontSize: this.fixChartFontSize(9)
                },
                nameGap: 5,
                axisLabel: {
                    textStyle: {
                        fontSize: this.fixChartFontSize(7)
                    },
                    formatter: function(params) {
                        const date = new Date(params);
                        return date.getMonth() + 1 + '/' + date.getDate();
                    }
                }
            },
            yAxis: {
                name: '人数',
                nameTextStyle: {
                    fontSize: this.fixChartFontSize(9)
                },
                nameGap: 10,
                axisLabel: {
                    textStyle: {
                        fontSize: this.fixChartFontSize(7)
                    }
                }
            },
            legend: {
                orient: 'horizontal',
                bottom: '13%',
                data: ['治愈', '死亡']
            },
            series: [
                {
                    name: '治愈',
                    data: curedData,
                    type: 'line',
                    symbolSize: SYMOBL_SIZE,
                    lineStyle: { width: LINE_WIDTH }
                },
                {
                    name: '死亡',
                    data: deadData,
                    type: 'line',
                    symbolSize: SYMOBL_SIZE,
                    lineStyle: { width: LINE_WIDTH }
                }
            ],
            color: ['#2dce89', '#86868d']
        };
    }

    public render() {
        const { data, area, path } = this.props;
        const orderedProvincesData = this.getOrderedTimeData(
            data.provincesSeries
        );
        const orderedCountryData = this.getOrderedTimeData(data.countrySeries);

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%'
                }}
            >
                <WebCellECharts
                    style={{ width: '100%', height: '50%' }}
                    chartOptions={this.getConfirmedSuspectChartOptions(
                        orderedProvincesData,
                        orderedCountryData,
                        area,
                        path
                    )}
                />
                <WebCellECharts
                    style={{ width: '100%', height: '50%' }}
                    chartOptions={this.getCuredDeadChartOptions(
                        orderedProvincesData,
                        orderedCountryData,
                        area,
                        path
                    )}
                />
            </div>
        );
    }
}
