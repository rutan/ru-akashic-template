// @ts-ignore
import { promiseExportZip } from '@akashic/akashic-cli-export/lib/zip/exportZip.js';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as packageJSON from '../package.json';
import { CustomLogger } from './modules/CustomLogger';

async function archiveForNicoLive(source: string, dest: string) {
  const logger = new CustomLogger();
  await promiseExportZip({
    source,
    dest,
    force: true,
    logger,
    bundle: true,
    babel: false,
    minify: false,
    minifyJs: false,
    minifyJson: true,
    packImage: false,
    strip: false,
    hashLength: 20,
    omitUnbundledJs: false,
    targetService: 'nicolive',
    nicolive: true,
  });
}

(async () => {
  const now = new Date();
  const outputName = [
    'nicolive-',
    now.getFullYear(),
    `${now.getMonth() + 1}`.padStart(2, '0'),
    `${now.getDate()}`.padStart(2, '0'),
    '-',
    `${now.getHours()}`.padStart(2, '0'),
    `${now.getMinutes()}`.padStart(2, '0'),
    `${now.getSeconds()}`.padStart(2, '0'),
    '-',
    packageJSON.version,
    '.zip',
  ].join('');

  const source = path.resolve('.', 'game');
  const distDir = path.resolve('.', '_dist');

  mkdirp.sync(distDir);

  await archiveForNicoLive(source, path.resolve(distDir, outputName));
})();
