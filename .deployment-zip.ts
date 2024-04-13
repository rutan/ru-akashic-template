import { defineConfig } from '@rutan/deployment-zip';
import { resolve } from 'node:path';
import * as packageJSON from './package.json';

const gameName = (packageJSON.name.split('/').pop() ?? '').replace(/\//g, '_');
const gameVersion = packageJSON.version.replace(/\./g, '_');
const timestamp = (() => {
  const now = new Date();
  return [
    now.getFullYear(),
    `${now.getMonth() + 1}`.padStart(2, '0'),
    `${now.getDate()}`.padStart(2, '0'),
    '-',
    `${now.getHours()}`.padStart(2, '0'),
    `${now.getMinutes()}`.padStart(2, '0'),
    `${now.getSeconds()}`.padStart(2, '0'),
  ].join('');
})();

export default defineConfig({
  ignores: [
    // OS
    '.DS_Store',
    'Thumb.db',
    'Desktop.ini',

    // AkashicEngine
    '*.d.ts',
  ],
  zip: {
    output() {
      return resolve('_dist', `${gameName}-${timestamp}-${gameVersion}.zip`);
    },
  },
});
