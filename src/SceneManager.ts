import { SampleScene } from './modules/sample';
import { BaseScene, SceneEvent } from './modules/_share';

class SceneManagerClass {
  /**
   * シーンの変更
   */
  changeScene(sceneName: string) {
    const scene: BaseScene = this._createScene(sceneName);
    scene.listener.on(this._handleSceneEvent.bind(this));

    // rootシーン(akashic:initial-scene)は置き換えていけないので注意
    if (g.game.scenes.length > 1) {
      g.game.replaceScene(scene);
    } else {
      g.game.pushScene(scene);
    }
  }

  /**
   * シーンイベントの受信
   */
  private _handleSceneEvent(e: SceneEvent) {
    switch (e.type) {
      case 'change': {
        this.changeScene(e.name);
        break;
      }
    }
  }

  /**
   * シーン名をもとにシーンを作成
   */
  private _createScene(name: string) {
    switch (name) {
      // case 'title':
      //   return new TitleScene({ game: g.game, assetPaths: ['/assets/**/*'] });
      default:
        return new SampleScene({ game: g.game, assetPaths: ['/assets/**/*'] });
    }
  }
}

export const SceneManager = new SceneManagerClass();
