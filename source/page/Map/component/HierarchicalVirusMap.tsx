/**
 * WebCell分层疫情地图组件
 * 在 VirusMap 基础上，增加聚焦到省显示市级数据与回到省级的功能
 * @author: yarray, shadowingszy
 *
 * 传入参数说明:
 * data: 地图数据
 * resolution: 时间精度
 */

import { observer } from 'mobx-web-cell';
// eslint-disable-next-line no-unused-vars
import { component, mixin, createCell, attribute, watch } from 'web-cell';
// eslint-disable-next-line no-unused-vars
import { VirusMap, STMapDataType } from './VirusMap';
// eslint-disable-next-line no-unused-vars
import {
    Series,
    ProvinceData,
    OverallCountryData,
    extractCitiesSeries
} from '../adapter';
import { isLandscape } from '../../../utility';

interface Props {
    data: OverallCountryData;
    resolution: number;
}

interface State {
    path: string[];
    currentChartArea: string;
}

interface DrillUpBtnStyle {
    display: string;
    position: string;
    width: string;
    height: string;
    padding: string;
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
}

function autoBreaks(values: number[]) {
    const base = [1, 10, 50, 100, 500, 1000];
    const k =
        (Math.floor(
            Math.max(...values.filter(v => v !== undefined)) / 5 / 500
        ) *
            500) /
        Math.max(...base);
    let res = base.map(b => k * b);
    res[0] = 1;
    return res;
}

@observer
@component({
    tagName: 'hierarchical-virus-map',
    renderTarget: 'children'
})
export class HierarchicalVirusMap extends mixin<Props, State>() {
    @attribute
    @watch
    public data: OverallCountryData = {
        provincesSeries: {},
        countrySeries: {}
    };

    @attribute
    @watch
    public resolution: number = 3600000;

    state = {
        path: [],
        currentChartArea: '中国'
    };
    navigateDown(params) {
        // if has name and path length < max length
        // TODO: check the data to see whether we can navigate down
        this.setState({
            path:
                params.name && this.state.path.length < 1
                    ? [...this.state.path, params.name]
                    : this.state.path,
            currentChartArea: params.name
        });
    }
    getVirusMapConfig(path, data, resolution) {
        let name = '中国';

        let dataOnMap: STMapDataType;
        if (path.length === 0) {
            dataOnMap = {
                timeline: Object.keys(data as Series<ProvinceData>)
                    .map(t => parseInt(t, 10))
                    .sort(),
                data
            };
        } else if (path.length === 1) {
            name = path[0];
            const citiesSeries = extractCitiesSeries(
                data,
                name,
                resolution,
                true
            );
            dataOnMap = {
                timeline: Object.keys(citiesSeries)
                    .map(t => parseInt(t, 10))
                    .sort(),
                data: citiesSeries
            };
        }
        return {
            name,
            data: dataOnMap,
            navigateDown: this.navigateDown.bind(this)
        };
    }
    navigateUp() {
        // back to country view
        if (this.state.path.length > 0) {
            this.setState({
                path: this.state.path.slice(0, this.state.path.length - 1),
                currentChartArea: '中国'
            });
        }
    }

    public render(
        { data, resolution }: Props,
        { path, currentChartArea }: State
    ) {
        const config = this.getVirusMapConfig(
            path,
            data.provincesSeries,
            resolution
        );

        const current =
            data.provincesSeries[
                Math.max(
                    ...Object.keys(data.provincesSeries).map(t =>
                        parseInt(t, 10)
                    )
                )
            ];

        let drillUpBtnStyle: DrillUpBtnStyle = {
            display: this.state.path.length > 0 ? 'block' : 'none',
            position: 'absolute',
            width: '30px',
            height: '30px',
            padding: '5px'
        };
        const isPC = isLandscape();

        if (isPC) {
            drillUpBtnStyle = {
                ...drillUpBtnStyle,
                top: '50px',
                left: '120px'
            };
        } else {
            drillUpBtnStyle = {
                ...drillUpBtnStyle,
                top: '10px',
                right: '10px'
            };
        }

        return (
            <div>
                <div style={{ position: 'relative' }}>
                    <VirusMap
                        name={config.name}
                        data={config.data}
                        breaks={autoBreaks(
                            Object.values(current).map(prov => prov.confirmed)
                        )} // use current province values to calculate viable mapping breaks
                        chartData={data}
                        chartPath={path}
                        currentChartArea={currentChartArea}
                        chartOnClickCallBack={config.navigateDown}
                        onDblClick={this.navigateUp.bind(this)}
                    />
                    <button
                        class="btn btn-dark"
                        style={drillUpBtnStyle}
                        onClick={this.navigateUp.bind(this)}
                    >
                        <span class="fa fa-undo"></span>
                    </button>
                </div>
            </div>
        );
    }
}
