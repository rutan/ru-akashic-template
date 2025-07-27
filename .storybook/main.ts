import { join } from 'node:path';
import type { StorybookConfig } from '@storybook/html-vite';
import { mergeConfig, normalizePath } from 'vite';
import viteConfig from '../vite.config';

const dirname = typeof __dirname !== 'undefined' ? __dirname : new URL('.', import.meta.url).pathname;

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|mjs|ts)'],
  core: {},
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  staticDirs: ['../game', '../static'],
  async viteFinal(config, { configType }) {
    const appConfig = viteConfig({
      command: 'serve',
      mode: configType === 'PRODUCTION' ? 'production' : 'development',
    });

    return mergeConfig(config, {
      resolve: {
        alias: {
          ...(appConfig.resolve?.alias || []),
        },
      },
      define: {
        ...(appConfig.define || {}),
      },
      plugins: [
        ...(appConfig.plugins || []),
        // game/assets 以下が更新された場合はフルリロードする
        {
          name: 'asset-reload',
          apply: 'serve',
          hotUpdate({ file }) {
            if (file.startsWith(normalizePath(join(dirname, '../game/assets/')))) {
              console.log(`HMR triggered for: ${file}`);
              this.environment.hot.send({ type: 'full-reload' });
              return [];
            }
          },
        },
      ],
    });
  },
};

export default config;
