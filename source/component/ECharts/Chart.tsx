import { ECharts, init } from 'echarts/core';
import { CustomElement, parseDOM } from 'web-utility';

import { ChartType, loadRenderer } from './utility';

export class EChartsElement extends HTMLElement implements CustomElement {
    #type: ChartType;
    #core?: ECharts;
    #buffer = [];

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
        this.addEventListener('optionchange', ({ detail }: CustomEvent) => {
            if (this.#core) this.#core.setOption(detail);
            else this.#buffer.push(detail);
        });
    }

    connectedCallback() {
        this.type ||= 'svg';
    }

    async #init(type: ChartType) {
        await loadRenderer(type);

        this.#core = init(this.shadowRoot.firstElementChild as HTMLDivElement);

        for (const option of this.#buffer) this.#core.setOption(option);

        this.#buffer.length = 0;
    }
}

customElements.define('ec-chart', EChartsElement);

declare global {
    interface HTMLElementTagNameMap {
        'ec-chart': EChartsElement;
    }
}
