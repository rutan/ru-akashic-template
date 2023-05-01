import { StorybookConfig } from '@storybook/core-common';

const baseConfig = require('../webpack.config');

module.exports = <StorybookConfig>{
  stories: ['../src/**/*.stories.@(js|ts)'],
  webpackFinal: async (config) => {
    config.module!.rules = baseConfig.module.rules.concat(config.module!.rules);
    config.resolve!.alias = {
      ...config.resolve!.alias,
      ...baseConfig.resolve.alias,
    };

    return config;
  },
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: {
        actions: true,
        backgrounds: true,
        controls: true,
        docs: true,
        viewport: false,
        toolbars: false
      }
    }
  ],
  core: {
    builder: 'webpack5'
  }
};
