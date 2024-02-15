/**
 * WebCell Echarts 可视化通用组件
 * 本地图组件为使用 ECharts 进行开发提供了基础组件
 * @author: shadowingszy
 *
 * 传入props说明:
 * chartOptions: ECharts 中的所有 options。
 */
import { WebCell, component, observer } from 'web-cell';
import { observable } from 'mobx';
import { EChartsType, EChartsOption, init } from 'echarts';

export interface CellChartsProps {
    chartOptions?: EChartsOption;
}

export interface CellCharts extends WebCell<CellChartsProps> {}

@component({ tagName: 'cell-charts' })
@observer
export class CellCharts
    extends HTMLElement
    implements WebCell<CellChartsProps>
{
    @observable
    accessor chartOptions = {};

    chart: EChartsType;

    mountedCallback() {
        this.classList.add('w-100', 'h-100');

        this.chart = init(this);
        this.chart.setOption(this.chartOptions, false, false);

        self.addEventListener('resize', () => this.chart.resize());
    }
}
