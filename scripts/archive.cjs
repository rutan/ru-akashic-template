const path = require('path');
const mkdirp = require('mkdirp');
const packageJSON = require('../package.json');
const { ConsoleLogger } = require('@akashic/akashic-cli-commons');
const { promiseExportZip } = require('@akashic/akashic-cli-export/lib/zip/exportZip.js');
const deployZip = require('@rutan/deployment-zip');

const ROOT_DIR = path.resolve(__dirname, '..');

async function archiveForWeb(publicDir, output) {
  await deployZip.deploy(publicDir, {
    output,
    ignore: [
      // OS
      '.DS_Store',
      'Thumb.db',
      'Desktop.ini',

      // akashic export
      '*.d.ts',
    ],
  });
}

async function archiveForNicoLive(source, dest) {
  const logger = new ConsoleLogger();
  await promiseExportZip({
    cwd: ROOT_DIR,
    source,
    dest,
    force: true,
    quiet: false,
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
    now.getFullYear(),
    `${now.getMonth() + 1}`.padStart(2, '0'),
    `${now.getDate()}`.padStart(2, '0'),
    '-',
    `${now.getHours()}`.padStart(2, '0'),
    `${now.getMinutes()}`.padStart(2, '0'),
    `${now.getSeconds()}`.padStart(2, '0'),
    '-',
    packageJSON.version,
  ].join('');

  const publicDir = path.resolve(ROOT_DIR, 'public');
  const source = path.resolve(ROOT_DIR, 'game');
  const distDir = path.resolve(ROOT_DIR, '_dist', outputName);

  mkdirp.sync(distDir);

  await Promise.all([
    archiveForWeb(publicDir, path.resolve(distDir, `web_${outputName}.zip`)),
    archiveForNicoLive(source, path.resolve(distDir, `nicolive_${outputName}.zip`)),
  ]);
})();
