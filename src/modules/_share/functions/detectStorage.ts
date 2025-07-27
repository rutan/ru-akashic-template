import { type Encoder, type IStorage, isLocalPlay, MockStorage, WebStorage } from '$libs';
import type { SaveData } from '../entities';

/**
 * 現在の実行環境に応じて、適切なストレージを選択する関数
 */
export function detectStorage({ gameKey }: { gameKey: string }): IStorage<SaveData> {
  if (isLocalPlay()) {
    return new WebStorage(gameKey, { customEncoder: customJsonEncoder });
  }

  // その他の環境は MockStorage を返す
  return new MockStorage();
}

const customJsonEncoder: Encoder<SaveData> = {
  encode(data: SaveData): Promise<string> {
    return Promise.resolve(JSON.stringify(data));
  },
  decode(str: string): Promise<SaveData> {
    try {
      const result = JSON.parse(str);
      return Promise.resolve(result);
    } catch (e) {
      console.error('Failed to parse save data:', e);
      return Promise.resolve({});
    }
  },
};
