import { type IStorage, MockStorage } from '$libs';
import type { SaveData } from '../entities';

/**
 * ローカルプレイ用のセーブ管理マネージャー
 */
export class SaveManager {
  private _storage: IStorage<SaveData>;
  private _data: SaveData;
  private _lazySaveTimer = 0;

  constructor(storage?: IStorage<SaveData>) {
    this._storage = storage || new MockStorage();
    this._data = {};
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
  importData(saveData: Partial<SaveData>) {
    try {
      this._data = saveData;
    } catch (e) {
      console.error('Failed to import save data:', e);
      this._data = {};
    }
  }

  /**
   * ゲームのセーブを実行（非同期）
   */
  save(): Promise<void> {
    return this._storage.save(this._data);
  }

  /**
   * 遅延セーブを実行（非同期）
   */
  lazySave() {
    // Node 環境では即座にセーブを実行
    if (typeof window === 'undefined') {
      this.save();
      return;
    }

    if (this._lazySaveTimer) {
      clearTimeout(this._lazySaveTimer);
      this._lazySaveTimer = 0;
    }

    this._lazySaveTimer = window.setTimeout(() => {
      this._lazySaveTimer = 0;
      this.save();
    }, 2500);
  }
}
