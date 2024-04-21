import { type Encoder, type IStorage, MockStorage, WebStorage, clone, isLocalPlay } from '$libs';
import type { SaveData } from '../entities';

/**
 * ローカルプレイ用のセーブ管理マネージャー
 */
class SaveManagerClass {
  private _storage: IStorage<SaveData> = new MockStorage();
  private _data: SaveData = {};
  private _initialData: SaveData = {};

  /**
   * 初期化
   * @param gameKey
   * @param initialData
   * @param customEncoder
   */
  setup(gameKey: string, initialData: SaveData, customEncoder?: Encoder<SaveData>) {
    this._initialData = initialData;
    this._data = clone(initialData);

    if (isLocalPlay()) {
      this._storage = new WebStorage(gameKey, { customEncoder });
    } else {
      this._storage = new MockStorage();
    }
  }

  /**
   * ロード済みのセーブデータ
   */
  get data() {
    return this._data;
  }

  /**
   * ゲームのロードを実行
   * @param scene
   * @param callback
   */
  load(scene: g.Scene, callback: (e: Error | undefined) => void) {
    this.loadWithPromise()
      .then(() => {
        scene.setTimeout(() => callback(undefined), 0);
      })
      .catch((e) => {
        scene.setTimeout(() => callback(e), 0);
      });
  }

  /**
   * ゲームのロードを実行（Promise版）
   */
  loadWithPromise(): Promise<void> {
    return this._storage.load().then((data) => {
      this._data = data || clone(this._initialData);
      return this._data;
    });
  }

  /**
   * ゲームのセーブを実行
   * @param scene
   * @param callback
   */
  save(scene: g.Scene, callback: (e: Error | undefined) => void) {
    this.saveWithPromise()
      .then(() => {
        scene.setTimeout(() => callback(undefined), 0);
      })
      .catch((e) => {
        scene.setTimeout(() => callback(e), 0);
      });
  }

  /**
   * ゲームのセーブを実行（Promise版）
   */
  saveWithPromise(): Promise<void> {
    return this._storage.save(this._data);
  }
}

export const SaveManager = new SaveManagerClass();
