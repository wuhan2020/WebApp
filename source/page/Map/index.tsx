import { attribute, component, observer } from 'web-cell';
import { observable } from 'mobx';
import { SpinnerBox } from 'boot-cell';
import { CustomElement, Hour } from 'web-utility';

import { HierarchicalVirusMap, VirusChart } from './component';
import {
    Series,
    ProvinceData,
    CountryOverviewData,
    CountryData,
    convertCountry,
    convertProvincesSeries,
    convertCountrySeries,
    convertStat
} from './adapter';
import { getHistory, getCurrent, getOverall } from '../../service';
import * as style from './index.module.css';

const resolution = Hour * 24;

@component({ tagName: 'maps-page' })
@observer
export default class MapsPage extends HTMLElement implements CustomElement {
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

        this.loadMapData();
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
        const { loading, virusData } = this;

        return (
            <SpinnerBox cover={loading}>
                {virusData && (
                    <HierarchicalVirusMap
                        data={virusData}
                        resolution={resolution}
                    />
                )}
                <VirusChart className="vh-100" />
            </SpinnerBox>
        );
    }
}
