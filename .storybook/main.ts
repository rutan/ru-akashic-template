import { join } from 'node:path';
import type { StorybookConfig } from '@storybook/html-vite';
import { mergeConfig, normalizePath, type Plugin } from 'vite';

const dirname = typeof __dirname !== 'undefined' ? __dirname : new URL('.', import.meta.url).pathname;

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|mjs|ts)'],
  core: {},
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  staticDirs: ['../game', '../static'],
  async viteFinal(baseConfig) {
    return mergeConfig(baseConfig, {
      plugins: [
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
        } satisfies Plugin,
      ],
    });
  },
};

export default config;
