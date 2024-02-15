import { CustomElement, toCamelCase, toHyphenCase } from 'web-utility';
import {
    BUILTIN_CHARTS_MAP,
    BUITIN_COMPONENTS_MAP,
    ECComponentOptionName,
    loadChart,
    loadComponent
} from './utility';

export abstract class ECOptionElement
    extends HTMLElement
    implements CustomElement
{
    #data = {};

    get chartTagName() {
        return toCamelCase(this.tagName.split('-')[1].toLowerCase());
    }

    get isSeries() {
        return this.chartTagName === 'series';
    }

    constructor() {
        super();

        const prototype = Object.getPrototypeOf(this);

        const prototypeProxy = new Proxy(prototype, {
            set: (_, key, value) => {
                if (typeof key === 'string') this.setProperty(key, value);
                else this[key] = value;

                return true;
            },
            get: (prototype, key, receiver) =>
                key in this.#data
                    ? this.#data[key]
                    : Reflect.get(prototype, key, receiver)
        });

        Object.setPrototypeOf(this, prototypeProxy);
    }

    connectedCallback() {
        if (!this.isSeries)
            loadComponent(this.chartTagName as ECComponentOptionName);

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

        const { isSeries } = this;

        if (isSeries && key === 'type' && value) return loadChart(value);

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

declare global {
    interface HTMLElementTagNameMap
        extends Record<`ec-${ECComponentOptionName}`, ECOptionElement> {}
}
