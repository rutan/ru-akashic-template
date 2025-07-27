import { type SplitEventmitter, splitEventmit } from '$libs';
import type { SceneEvent } from './SceneEvent';

/**
 * すべてのシーンの基底クラス
 */
export class BaseScene extends g.Scene {
  private _isReady: boolean;
  protected _emitter: SplitEventmitter<SceneEvent>;

  constructor(params: g.SceneParameterObject) {
    super(params);
    this._isReady = false;
    this._emitter = splitEventmit();

    this.onMessage.add(this.registerHandleMessage.bind(this));
    this.onLoad.addOnce(() => {
      this.create();
      this.onUpdate.add(this._updateFrameBase.bind(this));
    });
  }

  /**
   * イベントリスナーの取得
   */
  get listener() {
    return this._emitter.listener;
  }

  /**
   * アセットの読み込みが完了しているか？
   */
  isReady() {
    return this._isReady;
  }

  /**
   * アセット読み込み完了時に実行される処理
   * 継承先で定義する
   */
  create() {}

  /**
   * アセット読み込み完了後の1フレーム目に実行される処理
   * 継承先で定義する
   */
  start() {}

  /**
   * 毎フレーム実行される処理
   * 継承先で定義する
   */
  updateFrame() {}

  /**
   * 終了処理
   * 継承先で定義する
   */
  terminate() {}

  /**
   * メッセージイベントの受け取り
   */
  registerHandleMessage(_message: g.MessageEvent) {}

  /**
   * 毎フレーム呼び出し処理
   * @private
   */
  private _updateFrameBase() {
    if (!this._isReady) {
      this._isReady = true;
      this.start();
    }

    this.updateFrame();
  }
}
