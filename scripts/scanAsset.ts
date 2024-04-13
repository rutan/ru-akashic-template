import { ConsoleLogger } from '@akashic/akashic-cli-commons';
import { scanAsset } from '@akashic/akashic-cli-scan/lib/scanAsset';
import { watch } from 'chokidar';

class ScanLogger extends ConsoleLogger {
  info(message: string, cause?: any) {
    if (message === 'Done!') message = 'update game.json';

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
