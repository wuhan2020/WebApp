import { JsxProps } from 'dom-renderer';
import { EChartsOption, ResizeOpts } from 'echarts';
import { ECharts, init } from 'echarts/core';
import { ECBasicOption } from 'echarts/types/dist/shared';
import debounce from 'lodash.debounce';
import { CustomElement, parseDOM } from 'web-utility';

import { ProxyElement } from './Proxy';
import {
    BUILTIN_CHARTS_MAP,
    BUITIN_COMPONENTS_MAP,
    ChartType,
    ECChartOptionName,
    ECComponentOptionName,
    ZRElementEventHandler,
    ZRElementEventName,
    loadChart,
    loadComponent,
    loadRenderer
} from './utility';

export type EChartsElementEventHandler = Partial<
    Record<`on${Capitalize<ZRElementEventName>}`, ZRElementEventHandler>
>;
export interface EChartsElementProps
    extends ECBasicOption,
        EChartsElementEventHandler {
    theme?: Parameters<typeof init>[1];
    initOptions?: Parameters<typeof init>[2];
    resizeOptions?: ResizeOpts;
}

export type EChartsElementState = EChartsElementProps & EChartsOption;

export class EChartsElement
    extends ProxyElement<EChartsElementState>
    implements CustomElement
{
    #type: ChartType;
    #core?: ECharts;
    #eventHandlers: [ZRElementEventName, ZRElementEventHandler, string?][] = [];
    #eventData = [];

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

        this.attachShadow({ mode: 'open' }).append(
            parseDOM('<div style="height: 100%" />')[0]
        );
        this.addEventListener('optionchange', ({ detail }: CustomEvent) =>
            this.setOption(detail)
        );
    }

    connectedCallback() {
        this.type ||= 'svg';

        globalThis.addEventListener?.('resize', this.handleResize);
    }

    disconnectedCallback() {
        globalThis.removeEventListener?.('resize', this.handleResize);

        this.#core.dispose();
    }

    async #init(type: ChartType) {
        await loadRenderer(type);

        const { theme, initOptions, ...props } = this.toJSON();

        this.#core = init(
            this.shadowRoot.firstElementChild as HTMLDivElement,
            theme,
            initOptions
        );
        this.setOption(props);

        for (const [event, handler, selector] of this.#eventHandlers)
            if (selector) this.onChild(event, selector, handler);
            else this.on(event, handler);

        this.#eventHandlers.length = 0;

        for (const option of this.#eventData) this.setOption(option);

        this.#eventData.length = 0;
    }

    async setOption(data: EChartsOption) {
        if (!this.#core) {
            this.#eventData.push(data);
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
        super.setProperty(key, value);

        this.setOption(this.toJSON());
    }

    on(event: ZRElementEventName, handler: ZRElementEventHandler) {
        if (this.#core) this.#core.getZr().on(event, handler);
        else this.#eventHandlers.push([event, handler]);
    }

    onChild(
        event: ZRElementEventName,
        selector: string,
        handler: ZRElementEventHandler
    ) {
        if (this.#core) this.#core.on(event, selector, handler);
        else this.#eventHandlers.push([event, handler, selector]);
    }

    off(event: ZRElementEventName, handler: ZRElementEventHandler) {
        if (this.#core) this.#core.getZr().off(event, handler);
        else {
            const index = this.#eventHandlers.findIndex(
                item => item[0] === event && item[1] === handler && !item[2]
            );
            if (index > -1) this.#eventHandlers.splice(index, 1);
        }
    }

    offChild(
        event: ZRElementEventName,
        selector: string,
        handler: ZRElementEventHandler
    ) {
        if (this.#core) this.#core.off(event, handler);
        else {
            const index = this.#eventHandlers.findIndex(
                item =>
                    item[0] === event &&
                    item[1] === handler &&
                    item[2] === selector
            );
            if (index > -1) this.#eventHandlers.splice(index, 1);
        }
    }

    handleResize = debounce(() =>
        this.#core.resize(this.toJSON().resizeOptions)
    );
}

customElements.define('ec-chart', EChartsElement);

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'ec-chart': Omit<
                JsxProps<EChartsElement>,
                keyof EChartsElementEventHandler
            > &
                EChartsElementProps;
        }
    }
}
