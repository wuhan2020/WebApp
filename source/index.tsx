import { auto } from 'browser-unhandled-rejection';
import { DOMRenderer } from 'dom-renderer';
import { HTTPError } from 'koajax';
import { configure } from 'mobx';
import { documentReady, serviceWorkerUpdate } from 'web-utility';

import { PageFrame } from './page';

auto();

configure({ enforceActions: 'never' });

self.addEventListener('unhandledrejection', event => {
    if (!(event.reason instanceof URIError)) return;

    const { message } = (event.reason as HTTPError).body;

    if (!message) return;

    event.preventDefault();

    self.alert(message);
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
