import { JsxProps } from 'dom-renderer';
import { EChartsOption } from 'echarts';
import { CustomElement, toCamelCase, toHyphenCase } from 'web-utility';
import {
    BUILTIN_CHARTS_MAP,
    BUITIN_COMPONENTS_MAP,
    ECChartOptionName,
    ECComponentOptionName,
    proxyPrototype
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

    constructor() {
        super();

        proxyPrototype(this, this.#data, (key, value) =>
            this.setProperty(key.toString(), value)
        );
    }

    connectedCallback() {
        this.update();
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

    setAttribute(key: string, value: string) {
        super.setAttribute(key, value);

        if (key in Object.getPrototypeOf(this)) return;

        this[key] = key === value || value;
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

type PickSingle<T> = T extends infer S | (infer S)[] ? S : T;

type ECOptionElements = {
    [K in
        | ECComponentOptionName
        | ECChartOptionName as `ec-${K}`]: JsxProps<ECOptionElement> &
        PickSingle<EChartsOption[K]>;
};

declare global {
    namespace JSX {
        interface IntrinsicElements extends ECOptionElements {}
    }
}
