import { WebCell, component, attribute, observer } from 'web-cell';
import { observable } from 'mobx';
import { BGIcon } from 'boot-cell';
import { Hour } from 'web-utility';
import classNames from 'classnames';

import { EChartsMapProps } from './EChartsMap';
import { VirusMap, STMapDataType } from './VirusMap';

import { autoBreaks } from '../utility';
import {
    Series,
    ProvinceData,
    OverallCountryData,
    extractCitiesSeries
} from '../adapter';

import * as style from './HierarchicalVirusMap.module.css';

export interface HierarchicalVirusMapProps {
    /**
     * 地图数据
     */
    data: OverallCountryData;
    /**
     * 时间精度
     */
    resolution: number;
}

interface State {
    path: string[];
    currentChartArea: string;
}

export interface HierarchicalVirusMap
    extends WebCell<HierarchicalVirusMapProps> {}

/**
 * WebCell 分层疫情地图组件
 *
 * 在 VirusMap 基础上，增加聚焦到省显示市级数据与回到省级的功能
 *
 * @author yarray, shadowingszy
 */
@component({ tagName: 'hierarchical-virus-map' })
@observer
export class HierarchicalVirusMap
    extends HTMLElement
    implements WebCell<HierarchicalVirusMapProps>
{
    @observable
    accessor data: OverallCountryData = {
        provincesSeries: {},
        countrySeries: {}
    };

    @attribute
    @observable
    accessor resolution = Hour;

    @observable
    accessor state = {
        path: [],
        currentChartArea: '中国'
    };

    connectedCallback() {
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
            this.state = {
                path: path.slice(0, -1),
                currentChartArea: '中国'
            };
    };

    navigateDown: EChartsMapProps['onSeriesClick'] = ({ detail: { name } }) => {
        const { path } = this.state;
        // if has name and path length < max length
        // TODO: check the data to see whether we can navigate down
        this.state = {
            path: name && !path.length ? [...path, name] : path,
            currentChartArea: name
        };
    };

    render() {
        const { data, resolution } = this,
            { path, currentChartArea } = this.state;
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
            <>
                <VirusMap
                    name={config.name}
                    data={config.data}
                    breaks={autoBreaks(
                        Object.values(current).map(({ confirmed }) => confirmed)
                    )} // use current province values to calculate viable mapping breaks
                    chartData={data}
                    chartPath={path}
                    currentChartArea={currentChartArea}
                    onSeriesClick={this.navigateDown}
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
            </>
        );
    }
}
