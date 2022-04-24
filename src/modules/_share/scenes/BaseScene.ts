import { splitEventmit, SplitEventmitter } from '@/libs';
import { SceneEvent } from './SceneEvent';

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
      this.setupAtsumaruComment();
      this.onUpdate.add(this._updateFrameBase.bind(this));
    });
  }

  /**
   * アツマールにおけるコメントシーン名を取得
   */
  getAtsumaruCommentSceneName(): string {
    return '';
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
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  create() {}

  /**
   * アセット読み込み完了後の1フレーム目に実行される処理
   * 継承先で定義する
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  start() {}

  /**
   * 毎フレーム実行される処理
   * 継承先で定義する
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateFrame() {}

  /**
   * メッセージイベントの受け取り
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
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

  /**
   * アツマールコメントの設定
   * @private
   */
  private setupAtsumaruComment() {
    if (typeof window === 'undefined') return;
    if (!window.RPGAtsumaru) return;

    const name = this.getAtsumaruCommentSceneName();
    if (!name) return;

    window.RPGAtsumaru.comment.changeScene(name);
  }
}
