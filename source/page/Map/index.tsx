import 'echarts-jsx/dist/renderers/SVG';
import 'echarts-jsx/dist/components/geo';
import 'echarts-jsx/dist/charts/map';

import { SpinnerBox } from 'boot-cell';
import { observable } from 'mobx';
import { attribute, component, observer } from 'web-cell';
import { CustomElement, Hour, isEmpty } from 'web-utility';

import { AreaDailyModel, getCurrent, getHistory, getOverall } from '../../service';
import {
    convertCountry,
    convertCountrySeries,
    convertProvincesSeries,
    convertStat,
    CountryData,
    CountryOverviewData,
    ProvinceData,
    Series
} from './adapter';
import { HierarchicalVirusMap } from './component';
import * as style from './index.module.css';

const resolution = Hour * 24;

@component({ tagName: 'maps-page' })
@observer
export default class MapsPage extends HTMLElement implements CustomElement {
    areaDailyStore = new AreaDailyModel();

    @attribute
    @observable
    accessor loading = true;

    @observable
    accessor virusData: {
        provincesSeries: Series<ProvinceData>;
        countrySeries: Series<CountryOverviewData>;
        countryData?: CountryData;
    };

    mountedCallback() {
        this.classList.add(style.box);

        this.areaDailyStore.getAll({ countryName: '中国', updateTime: '2022-11-27' });
    }

    async loadMapData() {
        const [rawData, rawCurrentData, overviewData] = await Promise.all([
            getHistory(),
            getCurrent(),
            getOverall()
        ]);

        this.virusData = {
            provincesSeries: convertProvincesSeries(rawData, resolution, true),
            countrySeries: convertCountrySeries(overviewData.map(convertStat), resolution),
            countryData: convertCountry(rawCurrentData)
        };
        this.loading = false;
    }

    render() {
        const { virusData, areaDailyStore } = this;
        const { downloading, currentCountryCounts } = areaDailyStore;

        return (
            <SpinnerBox cover={downloading > 0}>
                {virusData && <HierarchicalVirusMap data={virusData} resolution={resolution} />}

                {!isEmpty(currentCountryCounts) && (
                    <ec-svg-renderer>
                        <ec-geo map="中国" />
                        <ec-map-chart
                            map="中国"
                            data={currentCountryCounts}
                            onClick={console.log}
                        />
                    </ec-svg-renderer>
                )}
            </SpinnerBox>
        );
    }
}
