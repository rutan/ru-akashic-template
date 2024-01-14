import * as AE from '@akashic/akashic-engine-standalone';
import * as gameJson from '../game/game.json';

export function mount(func: (scene: g.Scene) => g.E) {
  const canvas = document.createElement('canvas');

  const destroyFunc = AE.initialize({
    canvas,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    configuration: gameJson as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mainFunc(g: any) {
      const scene = new g.Scene({
        game: g.game,
        assetIds: [],
        assetPaths: ['/assets/**/*'],
      });
      scene.onLoad.addOnce(function () {
        const entity = func(scene);
        scene.append(entity);
      });
      g.game.pushScene(scene);
    },
  });

  window.addEventListener('beforeunload', () => {
    destroyFunc();
  });

  return canvas;
}
