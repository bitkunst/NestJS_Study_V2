// worker.ts
import { parentPort } from 'worker_threads';

const end = Date.now() + 10000;
while (Date.now() < end) {}

if (parentPort) {
    parentPort.postMessage('block for 10 seconds');
}
