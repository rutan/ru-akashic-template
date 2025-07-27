import { BaseScene, type SceneEvent } from '$share';
import { SampleScene } from './modules/sample';

class SceneManagerClass {
  /**
   * シーンの変更（名前指定）
   */
  changeScene(sceneName: string) {
    const scene: BaseScene = this._createScene(sceneName);
    this.changeWithScene(scene);
  }

  /**
   * シーンの変更（シーン指定）
   */
  changeWithScene(scene: BaseScene) {
    scene.listener.on(this._handleSceneEvent.bind(this));

    // rootシーン(akashic:initial-scene)は置き換えていけないので注意
    if (g.game.scenes.length > 1) {
      const currentScene = g.game.scene();
      if (currentScene && currentScene instanceof BaseScene) {
        currentScene.terminate();
      }

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
