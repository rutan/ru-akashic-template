import { GameConfiguration } from '@akashic/game-configuration';
import { StorybookAkashicParameters } from '@kudohamu/storybook-akashic';
import { initializePlugin } from '../src/initializePlugin';

const gameJson: GameConfiguration = require('../game/game.json');

export const parameters: StorybookAkashicParameters = {
  akashic: {
    assetPaths: ['/assets/**/*'],
    configuration: gameJson
  }
} as any;

export const decorators = [
  (story: any, a: any, b: any) => {
    console.log(story);
    console.log(a, b);
    initializePlugin();
    return story();
  }
];
