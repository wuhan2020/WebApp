import { auto } from 'browser-unhandled-rejection';
import { HTTPError } from 'koajax';
import { serviceWorkerUpdate } from 'web-utility/source/event';
import { documentReady, render, createCell } from 'web-cell';

import { PageFrame } from './page';

auto();

self.addEventListener('unhandledrejection', event => {
    if (!(event.reason instanceof URIError)) return;

    const { message } = (event.reason as HTTPError).body;

    if (!message) return;

    event.preventDefault();

    self.alert(message);
});

const { serviceWorker } = window.navigator;

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

documentReady.then(() => render(<PageFrame />));
