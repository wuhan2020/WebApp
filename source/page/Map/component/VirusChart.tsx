import { WebCell, component, attribute, observer } from 'web-cell';
import { observable } from 'mobx';
import { EChartsOption } from 'echarts';
import '../../../component/ECharts';

import { isLandscape } from '../utility';
import {
    Series,
    ProvinceData,
    CountryData,
    CountryOverviewData,
    OverallCountryData
} from '../adapter';
import { area as areaModel } from '../../../model';

export interface VirusChartProps {
    /**
     * 各省市或国家数据
     */
    data: OverallCountryData;
    /**
     * 当前选中的国家或省市
     */
    area: string;
    path: string[];
}

const LINE_WIDTH = 5,
    SYMOBL_SIZE = 10;

export interface VirusChart extends WebCell<VirusChartProps> {}

/**
 * WebCell 疫情数据折线图可视化组件
 *
 * 本组件使用 Stack Line chart 和 Line chart 展现信息
 *
 * @author shadowingszy
 */
@component({ tagName: 'virus-line-charts' })
@observer
export class VirusChart
    extends HTMLElement
    implements WebCell<VirusChartProps>
{
    @observable
    accessor data: OverallCountryData = {
        provincesSeries: {},
        countrySeries: {}
    };

    @attribute
    @observable
    accessor area = '';

    @attribute
    @observable
    accessor path: string[] = [];

    getOrderedTimeData(
        data: CountryData | Series<ProvinceData> | Series<CountryOverviewData>
    ) {
        const output = [];

        for (const property in data) {
            data[property].date = parseInt(property);

            output.push(data[property]);
        }

        return output.sort(({ date: A }, { date: B }) => A - B);
    }

    fixChartFontSize(baseFontSize: number) {
        const base =
            (baseFontSize *
                (window.innerWidth ||
                    document.documentElement.clientWidth ||
                    document.body.clientWidth)) /
            500;

        return base / (isLandscape() ? 2 : 1);
    }

    getData(
        orderedProvinceData: any[],
        orderedOverviewData: any[],
        area: string,
        path: string[]
    ) {
        const confirmedData = [],
            suspectedData = [],
            curedData = [],
            deadData = [];

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
                    confirmedData.push([item.date, item[area]?.confirmed || 0]);
                    suspectedData.push([item.date, item[area]?.suspected || 0]);
                    curedData.push([item.date, item[area]?.cured || 0]);
                    deadData.push([item.date, item[area]?.dead || 0]);
                }
            else
                for (const item of orderedProvinceData) {
                    confirmedData.push([
                        item.date,
                        item[path[0]]?.cities[area]?.confirmed || 0
                    ]);
                    suspectedData.push([
                        item.date,
                        item[path[0]]?.cities[area]?.suspected || 0
                    ]);
                    curedData.push([
                        item.date,
                        item[path[0]]?.cities[area]?.cured || 0
                    ]);
                    deadData.push([
                        item.date,
                        item[path[0]]?.cities[area]?.dead || 0
                    ]);
                }
        }

        return { confirmedData, suspectedData, curedData, deadData };
    }

    getConfirmedSuspectChartOptions(
        orderedProvinceData: any[],
        orderedOverviewData: any[],
        area: string,
        path: string[]
    ) {
        const { confirmedData, suspectedData } = this.getData(
            orderedProvinceData,
            orderedOverviewData,
            area,
            path
        );

        return {
            title: {
                text: area + '确诊/疑似患者人数'
            },
            xAxis: {
                nameTextStyle: {
                    fontSize: this.fixChartFontSize(9)
                },
                axisLabel: {
                    textStyle: {
                        fontSize: this.fixChartFontSize(7)
                    },
                    formatter(time: string | number) {
                        const date = new Date(time);

                        return date.getMonth() + 1 + '/' + date.getDate();
                    }
                }
            },
            yAxis: {
                nameTextStyle: {
                    fontSize: this.fixChartFontSize(9)
                },
                axisLabel: {
                    textStyle: {
                        fontSize: this.fixChartFontSize(7)
                    }
                }
            },
            series: [
                {
                    data: confirmedData,
                    symbolSize: SYMOBL_SIZE,
                    lineStyle: { width: LINE_WIDTH }
                },
                {
                    data: suspectedData,
                    symbolSize: SYMOBL_SIZE,
                    lineStyle: { width: LINE_WIDTH }
                }
            ]
        } as EChartsOption;
    }

    getCuredDeadChartOptions(
        orderedProvinceData: any[],
        orderedOverviewData: any[],
        area: string,
        path: string[]
    ) {
        const { curedData, deadData } = this.getData(
            orderedProvinceData,
            orderedOverviewData,
            area,
            path
        );

        return {
            title: {
                text: area + '治愈/死亡患者人数'
            },
            xAxis: {
                nameTextStyle: {
                    fontSize: this.fixChartFontSize(9)
                },
                axisLabel: {
                    textStyle: {
                        fontSize: this.fixChartFontSize(7)
                    },
                    formatter(time: string | number) {
                        const date = new Date(time);

                        return date.getMonth() + 1 + '/' + date.getDate();
                    }
                }
            },
            yAxis: {
                nameTextStyle: {
                    fontSize: this.fixChartFontSize(9)
                },
                axisLabel: {
                    textStyle: {
                        fontSize: this.fixChartFontSize(7)
                    }
                }
            },
            series: [
                {
                    data: curedData,
                    symbolSize: SYMOBL_SIZE,
                    lineStyle: { width: LINE_WIDTH }
                },
                {
                    data: deadData,
                    symbolSize: SYMOBL_SIZE,
                    lineStyle: { width: LINE_WIDTH }
                }
            ]
        } as EChartsOption;
    }

    mountedCallback() {
        this.classList.add('d-flex', 'flex-column');
    }

    render() {
        const { data, area, path } = this.props;

        const orderedProvincesData = this.getOrderedTimeData(
                data.provincesSeries
            ),
            orderedCountryData = this.getOrderedTimeData(data.countrySeries);

        return (
            <>
                <ec-chart className="w-100 h-50" theme="dark">
                    <ec-title text="ECharts Getting Started Example" />

                    <ec-legend data={['sales']} />

                    <ec-tooltip />

                    <ec-x-axis
                        data={[
                            'Shirts',
                            'Cardigans',
                            'Chiffons',
                            'Pants',
                            'Heels',
                            'Socks'
                        ]}
                    />
                    <ec-y-axis />

                    <ec-series
                        type="bar"
                        name="sales"
                        data={[5, 20, 36, 10, 10, 20]}
                        onClick={console.log}
                    />
                </ec-chart>

                <ec-chart className="w-100 h-50" color={['#c22b49', '#cca42d']}>
                    <ec-title text="确诊/疑似患者人数" top="5%" x="center" />
                    <ec-legend
                        orient="horizontal"
                        bottom="13%"
                        data={['确诊', '疑似']}
                    />
                    <ec-grid bottom="25%" left={60} />
                    <ec-x-axis name="日期" type="time" nameGap={5} />
                    <ec-y-axis name="人数" nameGap={10} />
                    {/* <ec-series
                        type="line"
                        name="确诊"
                        stack="总量"
                        areaStyle={{ color: '#f6bdcd' }}
                    />
                    <ec-series
                        type="line"
                        name="疑似"
                        stack="总量"
                        areaStyle={{ color: '#f9e4ba' }}
                    /> */}
                    <ec-tooltip trigger="axis" />
                </ec-chart>

                <ec-chart className="w-100 h-50" color={['#2dce89', '#86868d']}>
                    <ec-title text="治愈/死亡患者人数" top="5%" x="center" />
                    <ec-legend
                        orient="horizontal"
                        bottom="13%"
                        data={['治愈', '死亡']}
                    />
                    <ec-grid bottom="25%" left={60} />
                    <ec-x-axis name="日期" type="time" nameGap={5} />
                    <ec-y-axis name="人数" nameGap={10} />
                    {/* <ec-series type="line" name="治愈" />
                    <ec-series type="line" name="死亡" /> */}
                    <ec-tooltip trigger="axis" />
                </ec-chart>
            </>
        );
    }
}
