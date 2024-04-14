import { mergeConfig } from 'vite';
import type { StorybookConfig } from "@storybook/html-vite";
import viteConfig from '../vite.config';

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|mjs|ts)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
  ],
  core: {},
  framework: {
    name: "@storybook/html-vite",
    options: {},
  },
  staticDirs: [
    "../game"
  ],
  docs: {
    autodocs: "tag",
  },
  async viteFinal(config) {
    const appConfig = viteConfig({
      command: 'serve',
      mode: 'development',
    });

    return mergeConfig(config, {
      resolve: {
        alias: {
          ...(config.resolve?.alias || []),
          ...(appConfig.resolve?.alias || [])
        },
      },
      define: {
        ...(config.define || {}),
        ...(appConfig.define || {})
      }
    });
  },
};

export default config;
