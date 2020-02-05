/**
 * WebCell Echarts 可视化通用组件
 * 本地图组件为使用 ECharts 进行开发提供了基础组件
 * @author: shadowingszy
 *
 * 传入props说明:
 * chartOptions: ECharts 中的所有 options。
 */
import { component, mixin, watch } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { init } from 'echarts';

@observer
@component({
    tagName: 'cell-charts',
    renderTarget: 'children'
})
export class CellCharts extends mixin<{
    chartOptions?: any;
}>() {
    @watch
    chartOptions = {};

    chart: any;

    connectedCallback() {
        this.classList.add('w-100', 'h-100');
        // @ts-ignore
        this.chart = init(this).setOption(this.chartOptions, false, false);

        self.addEventListener('resize', () => this.chart?.resize());
    }
}
