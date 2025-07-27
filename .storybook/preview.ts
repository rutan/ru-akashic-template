import * as AE from '@akashic/akashic-engine-standalone';
import type { Preview } from '@storybook/html';
import gameJson from '../game/game.json';
import { initializePlugin } from '../src/initializePlugin';
import { initManagers } from '../src/modules/_share/functions/initManagers';

// グローバルで初期化状態を管理
let _akashicInitialized = false;
let _disposeAkashic: (() => void) | null = null;

const _akashicReady = new Promise<void>((resolve) => {
  // 既に初期化済みの場合は即座に解決
  if (_akashicInitialized) {
    resolve();
    return;
  }

  console.log('[.storybook/preview.ts] Akashic Engine Standalone is initializing...');

  // 既存のcanvasをチェック
  let canvas = document.getElementById('akashic-storybook-canvas') as HTMLCanvasElement;

  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'akashic-storybook-canvas';
    document.body.appendChild(canvas);
  } else {
    console.log('[.storybook/preview.ts] Reusing existing canvas');
  }

  _disposeAkashic = AE.initialize({
    canvas,
    configuration: gameJson as AE.GameConfiguration,
    // biome-ignore lint/suspicious/noExplicitAny: AkashicEngineのバージョンによる型の不一致を回避するため
    mainFunc(g: any) {
      window.g = g;

      const managers = initManagers();
      g.game.vars.managers = managers;
      g.game.vars.gameState = {
        score: 0,
      };

      initializePlugin();
      _akashicInitialized = true;
      resolve();
    },
  });
});

// HMRによるクリーンアップ処理
// @ts-ignore - Viteのimport.meta.hotの型定義
if (import.meta.hot) {
  // @ts-ignore
  import.meta.hot.dispose(() => {
    console.log('[.storybook/preview.ts] HMR cleanup...');
    _disposeAkashic?.();
    _akashicInitialized = false;
  });
}

const preview: Preview = {
  async beforeAll() {
    await _akashicReady;
  },
};

export default preview;
