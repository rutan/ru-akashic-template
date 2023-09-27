const { ConsoleLogger } = require('@akashic/akashic-cli-commons');

class CustomLogger extends ConsoleLogger {
  warn(message, cause) {
    if (message.startsWith('The following ES5 syntax errors exist')) return;
    if (message.startsWith('Non-ES5 syntax found')) return;

    super.warn(message, cause);
  }
}

module.exports = {
  CustomLogger,
};
