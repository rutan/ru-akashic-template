import { type IStorage, MockStorage } from '$libs';
import type { SaveData } from '../entities';

/**
 * ローカルプレイ用のセーブ管理マネージャー
 */
export class SaveManager {
  private _storage: IStorage<SaveData>;
  private _data: SaveData;
  private _lazySaveTimer = 0;
  private _lazySaveTask: Promise<void> | null = null;

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
      void this._executeLazySave();
      return;
    }

    if (this._lazySaveTimer) {
      clearTimeout(this._lazySaveTimer);
      this._lazySaveTimer = 0;
    }

    this._lazySaveTimer = window.setTimeout(() => {
      this._lazySaveTimer = 0;
      void this._executeLazySave();
    }, 2500);
  }

  /**
   * 保留中の遅延セーブを即座に実行し、完了を待つ
   */
  flush(): Promise<void> {
    if (this._lazySaveTimer) {
      clearTimeout(this._lazySaveTimer);
      this._lazySaveTimer = 0;
      return this._executeLazySave();
    }

    return this._lazySaveTask ?? Promise.resolve();
  }

  private _executeLazySave(): Promise<void> {
    const task = Promise.resolve().then(() => this.save());
    this._lazySaveTask = task;

    void task.catch((e) => {
      console.error('Failed to save data:', e);
    });
    void task.then(
      () => {
        if (this._lazySaveTask === task) this._lazySaveTask = null;
      },
      () => {
        if (this._lazySaveTask === task) this._lazySaveTask = null;
      },
    );

    return task;
  }
}
