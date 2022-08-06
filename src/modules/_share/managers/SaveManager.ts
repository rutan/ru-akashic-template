import { loadAllItems, SaveItems, saveItems } from '$libs';

/**
 * ローカルプレイ用のセーブ管理マネージャー
 */
class SaveManagerClass {
  private _gameKey = '';
  private _items: SaveItems = new Map();

  /**
   * ロード済みのセーブデータ
   */
  get items() {
    return this._items;
  }

  /**
   * localStorage用のprefix keyを設定する
   * @param str
   */
  setGameKey(str: string) {
    this._gameKey = str;
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
    return loadAllItems(this._gameKey).then((items) => {
      this._items = items;
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
    if (typeof window === 'undefined') return Promise.reject();
    return saveItems(this._gameKey, this._items);
  }
}

export const SaveManager = new SaveManagerClass();
