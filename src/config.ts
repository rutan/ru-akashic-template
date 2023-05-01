interface Config {
  game: {
    launch_mode: 'ranking' | 'multi';
  };
  storage: {
    prefix: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const config: Config = require('./config.yaml').default;
