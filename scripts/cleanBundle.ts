import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const __dirname = new URL('.', import.meta.url).pathname;
const bundlePath = resolve(__dirname, '../game/script/bundle.js');

await rm(bundlePath, { force: true });
console.log(`Bundle cleaned at ${bundlePath}`);
