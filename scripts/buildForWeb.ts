import { ConsoleLogger } from '@akashic/akashic-cli-commons';
// @ts-ignore
import { promiseExportHTML } from '@akashic/akashic-cli-export/lib/html/exportHTML.js';
// @ts-ignore
import { copySync } from 'cpx2';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as rimraf from 'rimraf';

const INJECT_HTML_NAME = 'inject.html';

class CustomLogger extends ConsoleLogger {
  warn(message: string, cause?: any) {
    if (message.startsWith('The following ES5 syntax errors exist')) return;
    if (message.startsWith('Non-ES5 syntax found')) return;

    super.warn(message, cause);
  }
}

async function buildForWeb(source: string, staticDir: string, distDir: string) {
  const logger = new CustomLogger();
  await promiseExportHTML({
    cwd: '.',
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

  copySync(path.resolve(staticDir, '**', '*'), distDir);
}

(async () => {
  const source = path.resolve('.', 'game');
  const staticDir = path.resolve('.', 'static');
  const distDir = path.resolve('.', 'tmp', '_build');

  rimraf.sync(distDir);
  mkdirp.sync(distDir);

  await buildForWeb(source, staticDir, distDir);
})();
