const path = require('path');
const cpx = require('cpx2');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const packageJSON = require('../package.json');
const { ConsoleLogger } = require('@akashic/akashic-cli-commons');
const { promiseExportHTML } = require('@akashic/akashic-cli-export/lib/html/exportHTML.js');
const { promiseExportZip } = require('@akashic/akashic-cli-export/lib/zip/exportZip.js');
const deployZip = require('@rutan/deployment-zip');

const ROOT_DIR = path.resolve(__dirname, '..');

async function buildForWeb(source, publicDir, output) {
  const tmpDir = path.resolve(ROOT_DIR, 'tmp', 'build');
  rimraf.sync(tmpDir);
  mkdirp.sync(tmpDir);

  const logger = new ConsoleLogger();
  await promiseExportHTML({
    cwd: ROOT_DIR,
    source,
    force: true,
    quiet: false,
    output: tmpDir,
    logger,
    strip: false,
    minify: false,
    bundle: false,
    magnify: true,
    injects: [],
    unbundleText: true,
    omitUnbundledJs: false,
    compress: false,
    // ファイル名ハッシュを有効にすると sandbox.config.js を連れていけず、
    // autoSendEventName が反映されなくなるため無効にする
    hashLength: 0,
    autoSendEventName: 'localLaunch',
  });

  cpx.copySync(path.resolve(publicDir, '**', '*'), tmpDir);

  await deployZip.deploy.deploy(tmpDir, {
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

async function buildForNicoLive(source, dest) {
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

  const source = path.resolve(ROOT_DIR, 'game');
  const publicDir = path.resolve(ROOT_DIR, 'public');
  const distDir = path.resolve(ROOT_DIR, '_dist', outputName);

  mkdirp.sync(distDir);

  await Promise.all([
    buildForWeb(source, publicDir, path.resolve(distDir, `web_${outputName}.zip`)),
    // buildForNicoLive(source, path.resolve(distDir, `nicolive_${outputName}.zip`)),
  ]);
})();
