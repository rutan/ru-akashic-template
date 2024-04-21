import { ConsoleLogger } from '@akashic/akashic-cli-commons';
import { scanAsset } from '@akashic/akashic-cli-scan/lib/scanAsset';
import { watch } from 'chokidar';

class ScanLogger extends ConsoleLogger {
  // biome-ignore lint/suspicious/noExplicitAny: AkashicEngine自体の型定義が any のため
  info(message: string, cause?: any) {
    if (message === 'Done!') {
      super.info('update game.json', cause);
      return;
    }

    super.info(message, cause);
  }
}

function doScan() {
  scanAsset({
    cwd: './game',
    logger: new ScanLogger(),
  });
}

if (process.argv.includes('-w')) {
  watch('./game', {
    ignoreInitial: true,
  })
    .on('add', doScan)
    .on('unlink', doScan);
  doScan();
} else {
  doScan();
}
