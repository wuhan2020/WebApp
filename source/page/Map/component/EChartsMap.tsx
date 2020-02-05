/**
 * WebCell Echarts热力图-地图可视化通用组件
 * 本地图组件为热力图-地图定制化开发提供了最高的自由度
 * @author: shadowingszy
 *
 * 传入props说明:
 * mapUrl: 地图json文件地址。
 * chartOptions: echarts中的所有options，注意，地图的map项值为'map'。
 * chartOnClickCallBack: 点击地图后的回调函数。
 * chartGeoRoamCallBack: 地图缩放事件回调函数。
 */
// eslint-disable-next-line no-unused-vars
import { component, mixin, attribute, watch } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { init, registerMap } from 'echarts';

import { long2short } from '../adapter';

interface MapProps {
    mapUrl?: string;
    chartOptions?: any;
    mapName?: string;
    chartOnClickCallBack?: (param: any, chart: any) => void;
    chartGeoRoamCallBack?: (param: any, chart: any) => void;
    chartAdjustLabel?: (param: any, chart: any) => void;
}

@observer
@component({
    tagName: 'echarts-map',
    renderTarget: 'children'
})
export class EChartsMap extends mixin<MapProps, {}>() {
    @attribute
    @watch
    public mapUrl: string = '';

    @attribute
    @watch
    public mapName: string = 'map';

    @watch
    public chartOptions: any = {};

    @watch
    public chartOnClickCallBack = (param, chart: any) => {
        console.log('click', param, chart);
    };

    @watch
    public chartGeoRoamCallBack = (param, chart) => {
        console.log('roam', param, chart);
    };

    @watch
    public chartAdjustLabel = (param, chart) => {
        console.log('adjust-label', param, chart);
    };

    chart: any;

    connectedCallback() {
        this.classList.add('w-100', 'h-100');
        // @ts-ignore
        this.chart = init(this);

        this.listen(), this.loadData();

        self.addEventListener('resize', () => {
            this.chart.resize();

            this.adjustLabel();
        });
    }

    adjustLabel() {
        this.props.chartAdjustLabel(null, this.chart);
    }

    listen() {
        const { chart, chartOnClickCallBack, chartOptions } = this;
        // implement hover-then-click on mobile devices
        var hovered = '';

        chart.on('mouseover', 'series', ({ name }) =>
            // prevent click event to trigger immediately
            setTimeout(() => (hovered = name))
        );
        chart.on('mouseout', 'series', () => (hovered = ''));

        chart.on('click', 'series', params => {
            if (hovered.length > 0) {
                chartOnClickCallBack(params, chart);
                hovered = '';
            }
        });
        chart.on('click', 'timeline', ({ dataIndex }) =>
            chart.dispatchAction({
                type: 'timelineChange',
                // index of time point
                currentIndex: chartOptions.baseOption.timeline.data.findIndex(
                    d => d === dataIndex
                )
            })
        );
    }

    async loadData() {
        const { chart, mapUrl, mapName, chartOptions } = this;

        chart.showLoading();

        const data = await (await fetch(mapUrl)).json();

        for (const { properties } of data.features)
            properties.name = long2short(properties.name);

        registerMap(mapName, data);

        chart.setOption(chartOptions);

        this.adjustLabel();

        chart.hideLoading();
    }
}
