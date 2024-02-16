import { JsxProps } from 'dom-renderer';
import { EChartsOption } from 'echarts';
import { ECharts, init } from 'echarts/core';
import { ECBasicOption } from 'echarts/types/dist/shared';
import { CustomElement, parseDOM } from 'web-utility';
import {
    BUILTIN_CHARTS_MAP,
    BUITIN_COMPONENTS_MAP,
    ChartType,
    ECChartOptionName,
    ECComponentOptionName,
    loadChart,
    loadComponent,
    loadRenderer,
    proxyPrototype
} from './utility';

export class EChartsElement extends HTMLElement implements CustomElement {
    #data: EChartsOption = {};
    #type: ChartType;
    #core?: ECharts;
    #buffer = [];

    toJSON() {
        return this.#core?.getOption();
    }

    set type(value: ChartType) {
        this.#type = value;
        this.setAttribute('type', value);
        this.#init(value);
    }

    get type() {
        return this.#type;
    }

    constructor() {
        super();

        proxyPrototype(this, this.#data, (key, value) =>
            this.setProperty(key.toString(), value)
        );
        this.attachShadow({ mode: 'open' }).append(
            parseDOM('<div style="height: 100%" />')[0]
        );
        this.addEventListener('optionchange', ({ detail }: CustomEvent) =>
            this.setOption(detail)
        );
    }

    connectedCallback() {
        this.type ||= 'svg';
    }

    async #init(type: ChartType) {
        await loadRenderer(type);

        this.#core = init(this.shadowRoot.firstElementChild as HTMLDivElement);

        this.setOption(this.#data);

        for (const option of this.#buffer) this.setOption(option);

        this.#buffer.length = 0;
    }

    async setOption(data: EChartsOption) {
        if (!this.#core) {
            this.#buffer.push(data);
            return;
        }

        for (const key of Object.keys(data))
            if (key in BUITIN_COMPONENTS_MAP)
                await loadComponent(key as ECComponentOptionName);
            else if (key in BUILTIN_CHARTS_MAP)
                await loadChart(key as ECChartOptionName);

        this.#core.setOption(data, false, true);
    }

    setProperty(key: string, value: any) {
        this.#data[key] = value;

        if (value != null)
            switch (typeof value) {
                case 'object':
                    break;
                case 'boolean':
                    if (value) super.setAttribute(key, key + '');
                    else super.removeAttribute(key);
                    break;
                default:
                    super.setAttribute(key, value + '');
            }
        else super.removeAttribute(key);

        this.setOption(this.#data);
    }
}

customElements.define('ec-chart', EChartsElement);

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'ec-chart': JsxProps<EChartsElement> & ECBasicOption;
        }
    }
}
