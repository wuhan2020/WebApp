import { ECElementEvent } from 'echarts';
import { proxyPrototype, toHyphenCase } from 'web-utility';

import { EventKeyPattern } from './utility';

export abstract class ProxyElement<T extends object> extends HTMLElement {
    #data = {} as T;

    toJSON() {
        return this.#data;
    }

    constructor() {
        super();

        proxyPrototype(this, this.#data, (key, value) =>
            this.setProperty(key.toString(), value)
        );
    }

    abstract on(event: string, handler: (event: any) => any): any;
    abstract off(event: string, handler: (event: any) => any): any;

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
    }
}
