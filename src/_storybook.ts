import * as AE from '@akashic/akashic-engine-standalone';
import * as gameJson from '../game/game.json';

/**
 * Storybookのrenderに渡す関数を生成する
 * @param mountFunc
 */
export function mount<T>(mountFunc: (params: T) => g.E) {
  return (params: T) => {
    const canvas = document.createElement('canvas');

    const destroyFunc = AE.initialize({
      canvas,
      configuration: gameJson as AE.GameConfiguration,
      // biome-ignore lint/suspicious/noExplicitAny: バージョンによる型の不一致を回避するため
      mainFunc(g: any) {
        const scene = new g.Scene({
          game: g.game,
          assetIds: [],
          assetPaths: ['/assets/**/*'],
        });
        scene.onLoad.addOnce(() => {
          const entity = mountFunc({ ...params, scene });
          scene.append(entity);
        });
        g.game.pushScene(scene);
      },
    });

    window.addEventListener('beforeunload', () => {
      destroyFunc();
    });

    return canvas;
  };
}
