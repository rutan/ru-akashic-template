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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mainFunc(g: any) {
        const scene = new g.Scene({
          game: g.game,
          assetIds: [],
          assetPaths: ['/assets/**/*'],
        });
        scene.onLoad.addOnce(function () {
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
