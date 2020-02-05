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
import { getVirusMapData } from '../../service/mapData';
import { isLandscape } from '../../utility';

interface MapPageState {
    loading?: boolean;
    virusData?: {
        provincesSeries?: Series<ProvinceData>;
        countrySeries?: Series<CountryOverviewData>;
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
        super.connectedCallback();
        this.loadMapData();
    }

    loadMapData = async () => {
        const [rawData, rawCurrentData, overviewData] = await Promise.all([
            getVirusMapData('history'),
            getVirusMapData('current'),
            getVirusMapData('overall')
        ]);

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
            width: '100%',
            height: isLandscape() ? 'calc(100vh - 100px)' : 'calc(100vh - 60px)'
        };

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
