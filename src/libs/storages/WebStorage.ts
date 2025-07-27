import { createJsonEncoder, type Encoder } from './encoder';
import type { IStorage } from './IStorage';

export class WebStorage<T> implements IStorage<T> {
  private readonly _storageKey: string;
  private readonly _encoder: Encoder<T>;

  constructor(storageKey: string, options?: { customEncoder?: Encoder<T> }) {
    this._storageKey = storageKey;
    this._encoder = options?.customEncoder ?? createJsonEncoder<T>();
  }

  load() {
    try {
      const item = localStorage.getItem(this._storageKey);
      if (!item) return Promise.resolve(null);

      return this._encoder.decode(item);
    } catch (err) {
      console.error(err);
      return Promise.reject(err);
    }
  }

  save(data: T): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        return this._encoder.encode(data).then((encodeData) => {
          localStorage.setItem(this._storageKey, encodeData);
          resolve();
        });
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  }
}
