/**
 * Storybookのrenderに渡す関数を生成する
 * @param mountFunc
 */
export function mount<T>(mountFunc: (params: T) => g.E) {
  return (params: T) => {
    // AkashicEngineで使うcanvasを取得
    const canvas = document.getElementById('akashic-storybook-canvas') as HTMLCanvasElement;
    if (!canvas) {
      throw new Error('Canvas not found');
    }

    const scene = new g.Scene({
      game: g.game,
      assetIds: [],
      assetPaths: ['/assets/**/*'],
    });
    scene.onLoad.addOnce(() => {
      const entity = mountFunc({ ...params, scene });
      scene.append(entity);
    });

    // 既にシーンがある場合はreplaceSceneを使う
    // ※ g.game.scenes[0] は AkashicEngine 自体が使うシーンなので replace しない
    if (g.game.scenes.length > 1) {
      g.game.replaceScene(scene);
    } else {
      g.game.pushScene(scene);
    }

    return canvas;
  };
}
