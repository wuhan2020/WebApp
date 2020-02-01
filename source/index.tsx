import { auto } from 'browser-unhandled-rejection';
import { HTTPError } from 'koajax';
import { documentReady, render, createCell } from 'web-cell';

import { PageRouter } from './page';

if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.ts');

auto();

self.addEventListener('unhandledrejection', event => {
    if (!(event.reason instanceof URIError)) return;

    const { message } = (event.reason as HTTPError).body;

    if (!message) return;

    event.preventDefault();

    self.alert(message);
});

documentReady.then(() => render(<PageRouter />));
