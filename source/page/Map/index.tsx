/* eslint-disable no-unused-vars */
import { component, createCell, mixin } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';

import { HierarchicalVirusMap } from './component';
import {
    Series,
    ProvinceData,
    CountryOverviewData,
    CountryData,
    convertCountry,
    convertProvincesSeries,
    convertCountrySeries
} from './adapter';
import { getHistory, getCurrent, getOverall, Province } from '../../service';
import style from './index.module.css';

interface MapPageState {
    loading?: boolean;
    virusData?: {
        provincesSeries: Series<ProvinceData>;
        countrySeries: Series<CountryOverviewData>;
        countryData?: CountryData;
    };
}

const resolution = 3600000 * 24;

@observer
@component({
    tagName: 'maps-page',
    renderTarget: 'children'
})
export class MapsPage extends mixin<{}, MapPageState>() {
    state = { loading: true, virusData: null };

    async connectedCallback() {
        this.classList.add(style.box);

        super.connectedCallback();

        this.loadMapData();
    }

    loadMapData = async () => {
        const [rawData, rawCurrentData, overviewData] = await Promise.all<
            Province[],
            Province[],
            {}[]
        >([getHistory(), getCurrent(), getOverall()]);

        const virusData = {
            provincesSeries: convertProvincesSeries(rawData, resolution, true),
            countrySeries: convertCountrySeries(overviewData, resolution),
            countryData: convertCountry(rawCurrentData)
        };

        await this.setState({ loading: false, virusData });
    };

    render(_, { loading, virusData }: MapPageState) {
        return (
            <SpinnerBox cover={loading}>
                {virusData ? (
                    <HierarchicalVirusMap
                        data={virusData}
                        resolution={resolution}
                    />
                ) : null}
            </SpinnerBox>
        );
    }
}
