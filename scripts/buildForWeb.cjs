const path = require('path');
const cpx = require('cpx2');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const { promiseExportHTML } = require('@akashic/akashic-cli-export/lib/html/exportHTML.js');
const { CustomLogger } = require('./modules/logger.cjs');

const ROOT_DIR = path.resolve(__dirname, '..');
const INJECT_HTML_NAME = 'inject.html';

async function buildForWeb(source, staticDir, distDir) {
  const logger = new CustomLogger();
  await promiseExportHTML({
    cwd: ROOT_DIR,
    source,
    force: true,
    quiet: false,
    output: distDir,
    logger,
    strip: false,
    minify: false,
    bundle: false,
    magnify: true,
    injects: [INJECT_HTML_NAME],
    unbundleText: true,
    omitUnbundledJs: false,
    compress: false,
    // ファイル名ハッシュを有効にすると sandbox.config.js を連れていけず、
    // autoSendEventName が反映されなくなるため無効にする
    hashLength: 0,
    autoSendEventName: 'localLaunch',
  });

  cpx.copySync(path.resolve(staticDir, '**', '*'), distDir);
}

(async () => {
  const source = path.resolve(ROOT_DIR, 'game');
  const staticDir = path.resolve(ROOT_DIR, 'static');
  const distDir = path.resolve(ROOT_DIR, '_dist', 'public');

  rimraf.sync(distDir);
  mkdirp.sync(distDir);

  await buildForWeb(source, staticDir, distDir);
})();
