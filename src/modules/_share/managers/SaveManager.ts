import { clone, type Encoder, type IStorage, isLocalPlay, MockStorage, WebStorage } from '$libs';
import type { SaveData } from '../entities';

/**
 * ローカルプレイ用のセーブ管理マネージャー
 */
class SaveManagerClass {
  private _storage: IStorage<SaveData> = new MockStorage();
  private _data: SaveData = {};

  /**
   * 初期化
   * @param gameKey
   * @param initialData
   * @param customEncoder
   */
  setup(gameKey: string, initialData: SaveData, customEncoder?: Encoder<SaveData>) {
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
   * ストレージ
   */
  get storage() {
    return this._storage;
  }

  /**
   * ゲームのセーブデータの値をインポート
   */
  importData(saveData: SaveData) {
    this._data = saveData;
  }

  /**
   * ゲームのセーブを実行（非同期）
   */
  save(): Promise<void> {
    return this._storage.save(this._data);
  }
}

export const SaveManager = new SaveManagerClass();
