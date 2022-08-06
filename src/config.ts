interface Config {
  game: {
    launch_mode: 'ranking' | 'multi';
  };
  storage: {
    prefix: string;
  };
  atsumaru: {
    thanksSetting?: {
      autoThanks: boolean;
      thanks: {
        text: string;
        image: string;
      };
      clap: {
        text: string;
        image: string;
      };
      gift: {
        text: string;
        image: string;
      };
    };
    nicoAdSetting?: {
      nicoAdBar?: {
        title: string;
        backgroundColor: string;
        textColor: string;
        scrollSpeed: number;
        scrollTimeMax: number;
        itemFormat: string;
        message: string;
      };
    };
  };
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const config: Config = require('./config.yaml').default;
