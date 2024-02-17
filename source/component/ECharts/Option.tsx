import { JsxProps } from 'dom-renderer';
import { EChartsOption } from 'echarts';
import { ECElementEvent } from 'echarts/core';
import {
    CustomElement,
    HyphenCase,
    PickSingle,
    proxyPrototype,
    toCamelCase,
    toHyphenCase
} from 'web-utility';

import { EChartsElement } from './Chart';
import {
    BUILTIN_CHARTS_MAP,
    BUITIN_COMPONENTS_MAP,
    ECChartOptionName,
    ECComponentOptionName,
    EventKeyPattern,
    ZRElementEventHandler,
    ZRElementEventName
} from './utility';

export abstract class ECOptionElement
    extends HTMLElement
    implements CustomElement
{
    #data: EChartsOption = {};

    toJSON() {
        return this.#data;
    }

    get chartTagName() {
        return toCamelCase(this.tagName.split('-')[1].toLowerCase());
    }

    get isSeries() {
        return this.chartTagName === 'series';
    }

    get eventSelector() {
        return [this.chartTagName, this['type']].filter(Boolean).join('.');
    }

    constructor() {
        super();

        proxyPrototype(this, this.#data, (key, value) =>
            this.setProperty(key.toString(), value)
        );
    }

    connectedCallback() {
        for (const [key, value] of Object.entries(this.#data))
            if (EventKeyPattern.test(key) && typeof value === 'function')
                this.on(
                    key.slice(2) as ZRElementEventName,
                    value as ZRElementEventHandler
                );
        this.update();
    }

    setProperty(key: string, value: any) {
        const oldValue = this.#data[key],
            name = toHyphenCase(key),
            eventName = key.slice(2) as ECElementEvent['type'];
        this.#data[key] = value;

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
        if (this.isConnected) this.update();
    }

    update() {
        this.dispatchEvent(
            new CustomEvent('optionchange', {
                bubbles: true,
                detail: {
                    [this.chartTagName]: this.isSeries
                        ? [this.#data]
                        : this.#data
                }
            })
        );
    }

    on(event: ZRElementEventName, handler: ZRElementEventHandler) {
        if (this.isConnected)
            this.closest<EChartsElement>('ec-chart')?.onChild(
                event,
                this.eventSelector,
                handler
            );
    }

    off(event: ZRElementEventName, handler: ZRElementEventHandler) {
        if (this.isConnected)
            this.closest<EChartsElement>('ec-chart')?.offChild(
                event,
                this.eventSelector,
                handler
            );
    }

    setAttribute(name: string, value: string) {
        super.setAttribute(name, value);

        const key = toCamelCase(name);

        if (key in Object.getPrototypeOf(this)) return;

        this[key] = name === value || value;
    }
}

for (const name of Object.keys({
    ...BUITIN_COMPONENTS_MAP,
    ...BUILTIN_CHARTS_MAP
}))
    customElements.define(
        `ec-${toHyphenCase(name)}`,
        class extends ECOptionElement {}
    );

type ECOptionElements = {
    [K in
        | ECComponentOptionName
        | ECChartOptionName as `ec-${HyphenCase<K>}`]: JsxProps<ECOptionElement> &
        PickSingle<EChartsOption[K]>;
};

declare global {
    namespace JSX {
        interface IntrinsicElements extends ECOptionElements {}
    }
}
