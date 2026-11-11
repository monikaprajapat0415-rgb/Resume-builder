// Blocking the event loop: one slow synchronous task freezes EVERY request.
import { monitorEventLoopDelay } from 'node:perf_hooks';

const histogram = monitorEventLoopDelay({ resolution: 10 });
histogram.enable();

function blockFor(ms) { const end = Date.now() + ms; while (Date.now() < end) { /* busy */ } }

setTimeout(() => {
  blockFor(300);                                   // pretend: a huge JSON.parse, a big loop, sync crypto
  setTimeout(() => {
    histogram.disable();
    const maxMs = histogram.max / 1e6;
    console.log('The event loop was stuck for about 300 ms:', maxMs >= 250);
  }, 50);
}, 50);
