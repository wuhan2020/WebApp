/**
 * WebCell分层疫情地图组件
 * 在 VirusMap 基础上，增加聚焦到省显示市级数据与回到省级的功能
 * @author: yarray, shadowingszy
 *
 * 传入参数说明:
 * data: 地图数据
 * resolution: 时间精度
 */
import {
    component,
    mixin,
    createCell,
    attribute,
    watch,
    Fragment
} from 'web-cell';
import { observer } from 'mobx-web-cell';
import { BGIcon } from 'boot-cell/source/Reminder/Icon';
import classNames from 'classnames';

// eslint-disable-next-line no-unused-vars
import { VirusMap, STMapDataType } from './VirusMap';

import { autoBreaks } from '../utility';
import {
    Series,
    ProvinceData,
    OverallCountryData,
    extractCitiesSeries
} from '../adapter';

import style from './HierarchicalVirusMap.module.css';

interface Props {
    data: OverallCountryData;
    resolution: number;
}

interface State {
    path: string[];
    currentChartArea: string;
}

@observer
@component({
    tagName: 'hierarchical-virus-map',
    renderTarget: 'children'
})
export class HierarchicalVirusMap extends mixin<Props, State>() {
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

    connectedCallback() {
        super.connectedCallback();

        this.classList.add('position-relative');
    }

    getVirusMapConfig(path: any[], data: any, resolution: number) {
        let name = '中国',
            dataOnMap: STMapDataType;

        switch (path.length) {
            case 0:
                dataOnMap = {
                    timeline: Object.keys(data as Series<ProvinceData>)
                        .map(t => parseInt(t, 10))
                        .sort(),
                    data
                };
                break;
            case 1: {
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
        }

        return { name, data: dataOnMap };
    }

    navigateUp = () => {
        const { path } = this.state;
        // back to country view
        if (path.length)
            this.setState({
                path: path.slice(0, -1),
                currentChartArea: '中国'
            });
    };

    navigateDown = params => {
        const { path } = this.state;
        // if has name and path length < max length
        // TODO: check the data to see whether we can navigate down
        this.setState({
            path: params.name && !path.length ? [...path, params.name] : path,
            currentChartArea: params.name
        });
    };

    render({ data, resolution }: Props, { path, currentChartArea }: State) {
        const config = this.getVirusMapConfig(
                path,
                data.provincesSeries,
                resolution
            ),
            current =
                data.provincesSeries[
                    Math.max(
                        ...Object.keys(data.provincesSeries).map(t =>
                            parseInt(t, 10)
                        )
                    )
                ];

        return (
            <Fragment>
                <VirusMap
                    name={config.name}
                    data={config.data}
                    breaks={autoBreaks(
                        Object.values(current).map(prov => prov.confirmed)
                    )} // use current province values to calculate viable mapping breaks
                    chartData={data}
                    chartPath={path}
                    currentChartArea={currentChartArea}
                    chartOnClickCallBack={this.navigateDown}
                    onDblClick={this.navigateUp}
                />

                <BGIcon
                    type="square"
                    name="undo"
                    className={classNames(
                        style.button,
                        path.length ? 'd-block' : 'd-none'
                    )}
                    onClick={this.navigateUp}
                />
            </Fragment>
        );
    }
}
