/* eslint-disable no-unused-vars */
import { component, createCell, mixin } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { HierarchicalVirusMap } from 'wuhan2020-map-viz';
import {
    Series,
    ProvinceData,
    CountryOverviewData,
    CountryData
} from 'wuhan2020-map-viz/source/adapters/patientStatInterface';

import {
    convertCountry,
    convertProvincesSeries,
    convertCountrySeries
} from 'wuhan2020-map-viz/source/adapters/isaaclin';

import { getVirusMapData } from '../service/mapData';

interface MapPageState {
    loading?: boolean;
    virusData?: {
        provincesSeries?: Series<ProvinceData>;
        countrySeries?: Series<CountryOverviewData>;
        countryData?: CountryData;
    };
}

const resolution = 3600000 * 24;
const isMobile = document.body.clientWidth < 720;

@observer
@component({
    tagName: 'maps-page',
    renderTarget: 'children'
})
export class MapsPage extends mixin<{}, MapPageState>() {
    state = { loading: true, virusData: null };

    async connectedCallback() {
        super.connectedCallback();
        this.loadMapData();
    }

    loadMapData = async () => {
        const rawData = await getVirusMapData('history');
        const rawCurrentData = await getVirusMapData('current');
        const overviewData = await getVirusMapData('overall');

        const virusData = {
            provincesSeries: convertProvincesSeries(
                rawData['results'],
                resolution,
                true
            ),
            countrySeries: convertCountrySeries(
                overviewData['results'],
                resolution
            ),
            countryData: convertCountry(rawCurrentData['results'])
        };

        await this.setState({ loading: false, virusData });
    };

    render(_, { loading, virusData }: MapPageState) {
        const mapContainerStyle: any = {
            width: '100%'
        };
        if (isMobile) {
            mapContainerStyle.height = 'calc(100vh - 60px)';
        } else {
            mapContainerStyle.height = 'calc(100vh - 100px)';
        }
        return (
            <div style={mapContainerStyle}>
                <SpinnerBox cover={loading}>
                    {virusData ? (
                        <HierarchicalVirusMap
                            data={virusData}
                            resolution={resolution}
                        />
                    ) : null}
                </SpinnerBox>
            </div>
        );
    }
}
