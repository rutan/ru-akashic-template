import { isAtsumaruSoloPlay, isLocalPlay } from './environments';
import { StorageItem } from '@atsumaru/api-types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SaveItems = Map<string, any>;

/**
 * 全セーブデータの読み込み
 * @param gameKey
 */
export function loadAllItems(gameKey: string): Promise<SaveItems> {
  if (isAtsumaruSoloPlay()) {
    return loadAllItemsAtsumaru().catch((e) => {
      // 非ログインエラーの場合は localStorage を使用する
      if (e.code === 'UNAUTHORIZED') {
        return loadAllItemsLocalStorage(gameKey);
      }

      return Promise.reject(e);
    });
  } else if (isLocalPlay()) {
    return loadAllItemsLocalStorage(gameKey);
  } else {
    return Promise.resolve(new Map());
  }
}

/**
 * セーブデータのデコード
 * @param str
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function decodeData(str: string): any {
  return JSON.parse(str);
}

/**
 * セーブデータのエンコード
 * @param obj
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function encodeData(obj: any) {
  return JSON.stringify(obj);
}

/**
 * アツマール上の全セーブデータ読み込み
 */
function loadAllItemsAtsumaru(): Promise<SaveItems> {
  if (typeof window === 'undefined' || !window.RPGAtsumaru) throw 'this site is not atsumaru';

  return window.RPGAtsumaru.storage.getItems().then((items) => {
    const result: SaveItems = new Map();

    items.forEach((item) => {
      try {
        result.set(item.key, decodeData(item.value));
      } catch (e) {
        console.error(e);
      }
    });

    return result;
  });
}

/**
 * ローカルストレージ上の全セーブデータ読み込み
 * gameKey を利用して不要なデータは読み込まないようにする
 */
function loadAllItemsLocalStorage(gameKey: string): Promise<SaveItems> {
  if (typeof window === 'undefined' || !window.localStorage) throw 'can not use localStorage';

  const result: SaveItems = new Map();

  for (let i = 0; i < localStorage.length; ++i) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (!isValidGameKey(gameKey, key)) continue;
    try {
      const item = localStorage.getItem(key);
      if (item) result.set(decodeKey(gameKey, key), decodeData(item));
    } catch (e) {
      console.error(key, e);
    }
  }

  return Promise.resolve(result);
}

/**
 * セーブデータの書き込み
 * @param gameKey
 * @param items
 */
export function saveItems(gameKey: string, items: SaveItems): Promise<void> {
  if (isAtsumaruSoloPlay()) {
    return saveItemsAtsumaru(items).catch((e) => {
      // 非ログインエラーの場合は localStorage を使用する
      if (e.code === 'UNAUTHORIZED') {
        return saveItemsLocalStorage(gameKey, items);
      }

      return Promise.reject(e);
    });
  } else if (isLocalPlay()) {
    return saveItemsLocalStorage(gameKey, items);
  } else {
    return Promise.resolve();
  }
}

/**
 * アツマールAPIへのセーブデータの書き込み
 */
function saveItemsAtsumaru(items: SaveItems): Promise<void> {
  if (typeof window === 'undefined' || !window.RPGAtsumaru) throw 'this site is not atsumaru';

  const data: StorageItem[] = [];
  items.forEach((value, key) => data.push({ key, value: encodeData(value) }));
  return window.RPGAtsumaru.storage.setItems(data);
}

/**
 * ローカルストレージ上へのセーブデータの書き込み
 * gameKey を利用して同一ドメインでのkey名重複を回避する
 */
function saveItemsLocalStorage(gameKey: string, items: SaveItems): Promise<void> {
  if (typeof window === 'undefined' || !window.localStorage) throw 'can not use localStorage';

  try {
    items.forEach((value, key) => {
      localStorage.setItem(generateKey(gameKey, key), encodeData(value));
    });
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
}

/**
 * 指定のストレージキーが正しいか？
 * @param gameKey
 * @param storageKey
 */
function isValidGameKey(gameKey: string, storageKey: string) {
  if (!gameKey) return true;
  return storageKey.startsWith(`${gameKey}::`);
}

/**
 * localStorage用のストレージキーの生成
 * @param gameKey
 * @param originalStorageKey
 */
function generateKey(gameKey: string, originalStorageKey: string) {
  if (!gameKey) return originalStorageKey;
  return `${gameKey}::${originalStorageKey}`;
}

/**
 * localStorage用のストレージキーから元のストレージキーを生成
 * @param gameKey
 * @param storageKey
 */
function decodeKey(gameKey: string, storageKey: string) {
  if (!gameKey) return storageKey;
  return storageKey.replace(`${gameKey}::`, '');
}
