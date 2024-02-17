import { JsxProps } from 'dom-renderer';
import { EChartsOption } from 'echarts';
import {
    CustomElement,
    HyphenCase,
    PickSingle,
    toCamelCase,
    toHyphenCase
} from 'web-utility';

import { EChartsElement } from './Chart';
import { ProxyElement } from './Proxy';
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
    extends ProxyElement<EChartsOption>
    implements CustomElement
{
    get chartTagName() {
        return toCamelCase(this.tagName.split('-')[1].toLowerCase());
    }

    get isSeries() {
        return this.chartTagName === 'series';
    }

    get eventSelector() {
        return [this.chartTagName, this['type']].filter(Boolean).join('.');
    }

    connectedCallback() {
        for (const [key, value] of Object.entries(this.toJSON()))
            if (EventKeyPattern.test(key) && typeof value === 'function')
                this.on(
                    key.slice(2) as ZRElementEventName,
                    value as ZRElementEventHandler
                );
        this.update();
    }

    setProperty(key: string, value: any) {
        super.setProperty(key, value);

        if (this.isConnected) this.update();
    }

    update() {
        const data = this.toJSON();

        this.dispatchEvent(
            new CustomEvent('optionchange', {
                bubbles: true,
                detail: {
                    [this.chartTagName]: this.isSeries ? [data] : data
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

const ECOptionNames = [
    ...Object.keys({ ...BUITIN_COMPONENTS_MAP, ...BUILTIN_CHARTS_MAP }),
    'series'
];

for (const name of ECOptionNames)
    customElements.define(
        `ec-${toHyphenCase(name)}`,
        class extends ECOptionElement {}
    );

type ECOptionName = ECComponentOptionName | ECChartOptionName | 'series';

type ECOptionElements = {
    [K in ECOptionName as `ec-${HyphenCase<K>}`]: JsxProps<ECOptionElement> &
        PickSingle<EChartsOption[K]>;
};

declare global {
    namespace JSX {
        interface IntrinsicElements extends ECOptionElements {}
    }
}
