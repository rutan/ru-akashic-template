import { easeInOutSine, Group } from '@rutan/frame-tween';
import { assetsSample1, createWithAsset } from '$assets';
import { createTween, splitEventmit } from '$libs';

export type SampleSpriteEvents = SampleSpritePointDownEvent | SampleSpritePointUpEvent | SampleSpriteAnimationEndEvent;

export interface SampleSpritePointDownEvent {
  type: 'pointDown';
}

export interface SampleSpritePointUpEvent {
  type: 'pointUp';
}

export interface SampleSpriteAnimationEndEvent {
  type: 'animationEnd';
}

export interface SampleSpriteParameterObject extends g.EParameterObject {
  name: 'a' | 'ru';
}

export class SampleSprite extends g.E {
  private _emitter = splitEventmit<SampleSpriteEvents>();
  private _group = new Group();

  private _name: 'a' | 'ru';
  private _sprite!: g.Sprite;

  constructor(param: SampleSpriteParameterObject) {
    super(param);
    this._name = param.name;
    this._createSprite();

    this.onUpdate.add(() => {
      this._group.update();
    });
  }

  get listener() {
    return this._emitter.listener;
  }

  private _createSprite() {
    this._sprite = createWithAsset(this.scene, g.Sprite, assetsSample1, this._name, {
      anchorX: 0.5,
      anchorY: 0.5,
      touchable: true,
    });
    this.append(this._sprite);

    this._sprite.onPointDown.add(() => {
      this._emitter.emit({ type: 'pointDown' });

      this._group.clear();

      createTween(this._sprite, this._group)
        .to(
          {
            x: g.game.random.generate() * g.game.width - g.game.width / 2,
            y: g.game.random.generate() * g.game.height - g.game.height / 2,
          },
          g.game.fps * g.game.random.generate() * 3,
          easeInOutSine,
        )
        .call(() => {
          this._emitter.emit({ type: 'animationEnd' });
        })
        .start();
    });

    this._sprite.onPointUp.add(() => {
      this._emitter.emit({ type: 'pointUp' });
    });
  }
}
