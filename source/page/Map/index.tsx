import 'echarts-jsx/dist/renderers/SVG';
import 'echarts-jsx/dist/components/grid';
import 'echarts-jsx/dist/components/geo';
import 'echarts-jsx/dist/charts/bar';
import 'echarts-jsx/dist/charts/map';

import { EpidemicAreaReport } from '@wuhan2020/rest-api';
import { SpinnerBox } from 'boot-cell';
import { CallbackDataParams } from 'echarts/types/dist/shared';
import { computed } from 'mobx';
import { component, observer } from 'web-cell';
import { CustomElement, isEmpty, sum } from 'web-utility';

import { CountryMonthlyModel, ProvinceMonthlyModel } from '../../service';
import * as style from './index.module.css';

@component({ tagName: 'maps-page' })
@observer
export default class MapsPage extends HTMLElement implements CustomElement {
    countryMonthlyStore = new CountryMonthlyModel();
    provinceMonthlyStore = new ProvinceMonthlyModel();

    @computed
    get barXAxis() {
        return this.countryMonthlyStore.allItems.map(({ month }) => month);
    }

    @computed
    get barStacks() {
        return this.countryMonthlyStore.allItems.reduce(
            (sum, { continentName, countryName, month, ...data }) => {
                for (const key in data) (sum[key] ??= []).push(data[key]);

                return sum;
            },
            {} as Record<keyof EpidemicAreaReport, number[]>
        );
    }

    @computed
    get mapData() {
        return this.provinceMonthlyStore.allItems.map(
            ({ provinceName, suspectedCount, confirmedCount, curedCount, deadCount }) => ({
                name: provinceName,
                value: sum(suspectedCount, confirmedCount, curedCount, deadCount)
            })
        );
    }

    async mountedCallback() {
        this.classList.add(style.box);

        await this.countryMonthlyStore.getAll({ countryName: '中国' });

        const { month } = this.countryMonthlyStore.allItems.at(-1) ?? {};

        await this.provinceMonthlyStore.getAll({ countryName: '中国', month });
    }

    changeDate = ({ detail }) => {
        const month = this.barXAxis[(detail as CallbackDataParams).dataIndex];

        return this.provinceMonthlyStore.getAll({ countryName: '中国', month });
    };

    renderMap = () => (
        <ec-svg-renderer>
            <ec-geo map="中国" />
            <ec-map-chart map="中国" data={this.mapData} onClick={console.log} />
        </ec-svg-renderer>
    );

    renderBarChart = () => (
        <ec-svg-renderer>
            <ec-x-axis type="category" data={this.barXAxis} />
            <ec-y-axis type="value" />
            {Object.entries(this.barStacks).map(([name, data]) => (
                <ec-bar-chart stack="month" {...{ name, data }} onClick={this.changeDate} />
            ))}
        </ec-svg-renderer>
    );

    render() {
        const { barStacks, mapData } = this;

        return (
            <SpinnerBox cover={isEmpty(mapData)}>
                {!isEmpty(mapData) && this.renderMap()}

                {!isEmpty(barStacks) && this.renderBarChart()}
            </SpinnerBox>
        );
    }
}
