/*
 * game.json のフォーマッター
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { AssetConfiguration, AssetConfigurationMap, GameConfiguration } from '@akashic/game-configuration';

const __dirname = new URL('.', import.meta.url).pathname;
const gameJsonPath = join(__dirname, '../game/game.json');

const originalGameJson = await readFile(gameJsonPath, 'utf-8');
const gameJson = JSON.parse(originalGameJson) as GameConfiguration;

const assetsArray = Object.entries(gameJson.assets).map(([key, asset]) => ({
  key,
  ...asset,
}));

// グローバルなアセットを先頭にソートする
// それ以外はパス順にソートする
const sortedAssets = assetsArray.sort((a, b) => {
  if (a.global === true && b.global !== true) return -1;
  if (a.global !== true && b.global === true) return 1;

  return a.path.localeCompare(b.path);
});

// パスに 'bgm' が含まれるオーディオアセットは systemId を 'music' に設定する
const updatedAssets = sortedAssets.map((asset) => {
  if (asset.type === 'audio' && asset.path.includes('bgm')) {
    return { ...asset, systemId: 'music' };
  }
  return asset;
});

const assetsObject: AssetConfigurationMap = {};
updatedAssets.forEach((asset) => {
  const { key, ...assetData } = asset;
  assetsObject[key] = assetData as AssetConfiguration;
});

gameJson.assets = assetsObject;

const formattedJson = `${JSON.stringify(gameJson, null, '\t')}\n`;
await writeFile(gameJsonPath, formattedJson);

console.log('game.json formatted successfully!');
