import { cp, mkdir, rm } from 'node:fs/promises';
import * as path from 'node:path';
import { promiseExportHTML } from '@akashic/akashic-cli-export/lib/html/exportHTML.js';
import { CustomLogger } from './modules/CustomLogger.ts';

const INJECT_HTML_NAME = 'inject.html';

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
    hashLength: 20,
    autoSendEventName: 'localLaunch',
    terser: {
      compress: false,
    },
  });

  await cp(staticDir, distDir, { recursive: true });
}

(async () => {
  const source = path.resolve('.', 'game');
  const staticDir = path.resolve('.', 'static');
  const distDir = path.resolve('.', 'tmp', '_build');

  try {
    await rm(distDir, { recursive: true });
  } catch {
    // nothing to do
  }
  await mkdir(distDir, { recursive: true });

  await buildForWeb(source, staticDir, distDir);
})();
