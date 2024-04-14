import { ConsoleLogger } from '@akashic/akashic-cli-commons';

export class CustomLogger extends ConsoleLogger {
  warn(message: string, cause?: any) {
    if (message.startsWith('The following ES5 syntax errors exist')) return;
    if (message.startsWith('Non-ES5 syntax found')) return;

    super.warn(message, cause);
  }
}
