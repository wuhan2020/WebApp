import { auto } from 'browser-unhandled-rejection';
import { DOMRenderer } from 'dom-renderer';
import { HTTPError } from 'koajax';
import { configure } from 'mobx';
import { documentReady, serviceWorkerUpdate } from 'web-utility';

import { PageFrame } from './page';

auto();

configure({ enforceActions: 'never' });

self.addEventListener('unhandledrejection', ({ reason }) => {
    if (!(reason instanceof URIError)) return;

    const { message, response } = reason as HTTPError;
    const { statusText, body } = response || {};

    const tips = body?.message || message || statusText;

    if (tips) alert(tips);
});

const { serviceWorker } = window.navigator;

if (process.env.NODE_ENV !== 'development')
    serviceWorker
        ?.register('sw.js')
        .then(serviceWorkerUpdate)
        .then(worker => {
            if (window.confirm('检测到新版本，是否立即启用？'))
                worker.postMessage({ type: 'SKIP_WAITING' });
        });

serviceWorker?.addEventListener('controllerchange', () =>
    window.location.reload()
);

documentReady.then(() => new DOMRenderer().render(<PageFrame />));
