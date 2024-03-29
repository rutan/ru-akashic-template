import { assetsSample1, assetsSample2, createWithAsset } from '$assets';
import { BaseScene } from '$share';

export class SampleScene extends BaseScene {
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
    sprite2.onPointDown.add((e: g.PointDownEvent) => {
      switch (e.button) {
        case 0: {
          console.log('leftClick');
          break;
        }
        case 1: {
          console.log('centerClick');
          break;
        }
        case 2: {
          console.log('rightClick');
          break;
        }
        default:
          console.log('otherClick');
      }
    });

    sprite2.onPointUp.add(() => {
      // 次のシーンへ移動
      this._emitter.emit({ type: 'change', name: 'title' });
    });
  }
}
