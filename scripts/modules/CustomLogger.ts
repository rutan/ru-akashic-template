import { ConsoleLogger } from '@akashic/akashic-cli-commons';

export class CustomLogger extends ConsoleLogger {
  // biome-ignore lint/suspicious/noExplicitAny: AkashicEngine自体の型定義が any のため
  warn(message: string, cause?: any) {
    if (message.startsWith('The following ES5 syntax errors exist')) return;
    if (message.startsWith('Non-ES5 syntax found')) return;

    super.warn(message, cause);
  }
}
