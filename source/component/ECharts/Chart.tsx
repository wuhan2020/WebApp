import { JsxProps } from 'dom-renderer';
import { ECElementEvent, EChartsOption } from 'echarts';
import { ECharts, init } from 'echarts/core';
import { ECBasicOption } from 'echarts/types/dist/shared';
import {
    CustomElement,
    parseDOM,
    proxyPrototype,
    toHyphenCase
} from 'web-utility';

import {
    BUILTIN_CHARTS_MAP,
    BUITIN_COMPONENTS_MAP,
    ChartType,
    ECChartOptionName,
    ECComponentOptionName,
    EventKeyPattern,
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
}

export class EChartsElement extends HTMLElement implements CustomElement {
    #props: EChartsElementProps & EChartsOption = {};
    #type: ChartType;
    #core?: ECharts;
    #eventHandlers: [ZRElementEventName, ZRElementEventHandler, string?][] = [];
    #eventData = [];

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

        proxyPrototype(this, this.#props, (key, value) =>
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

        const { theme, initOptions } = this.#props;

        this.#core = init(
            this.shadowRoot.firstElementChild as HTMLDivElement,
            theme,
            initOptions
        );
        this.setOption(this.#props);

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
        const oldValue = this.#props[key],
            name = toHyphenCase(key),
            eventName = key.slice(2) as ECElementEvent['type'];
        this.#props[key] = value;

        switch (typeof value) {
            case 'object':
                if (!value) this.removeAttribute(name);
                break;
            case 'boolean':
                if (value) super.setAttribute(name, name + '');
                else super.removeAttribute(name);
                break;
            case 'function':
                if (EventKeyPattern.test(key)) this.on(eventName, value);
                break;
            default:
                if (value != null) super.setAttribute(name, value + '');
                else if (
                    EventKeyPattern.test(key) &&
                    typeof oldValue === 'function'
                )
                    this.off(eventName, value);
                else super.removeAttribute(name);
        }
        this.setOption(this.#props);
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
