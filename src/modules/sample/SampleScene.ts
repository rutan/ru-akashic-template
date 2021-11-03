import { assetsSample1, assetsSample2, createWithAsset } from '@/assets';
import { BaseScene } from '@/modules/_share';
import { asRightClickable } from '@rutan/akashic-right-click-plugin';

export class SampleScene extends BaseScene {
  getAtsumaruCommentSceneName() {
    return 'Sample';
  }

  create() {
    const sprite1 = createWithAsset(this, g.Sprite, assetsSample1, 'a', {
      x: 100,
    });
    this.append(sprite1);

    const sprite2 = createWithAsset(this, g.Sprite, assetsSample2, 'ru', {
      x: 200,
      y: 100,
      touchable: true,
    });
    this.append(sprite2);
    asRightClickable(sprite2).rightClickDown.add(() => {
      console.log('rightClick');
    });

    sprite2.onPointUp.add(() => {
      // 次のシーンへ移動
      this._emitter.emit({ type: 'change', name: 'title' });
    });
  }
}
