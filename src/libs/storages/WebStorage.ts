import { createJsonEncoder, type Encoder } from './encoder';
import type { IStorage } from './IStorage';

export class WebStorage<T> implements IStorage<T> {
  private readonly _storageKey: string;
  private readonly _encoder: Encoder<T>;

  constructor(storageKey: string, options?: { customEncoder?: Encoder<T> }) {
    this._storageKey = storageKey;
    this._encoder = options?.customEncoder ?? createJsonEncoder<T>();
  }

  async load(): Promise<T | null> {
    const item = localStorage.getItem(this._storageKey);
    if (item === null) return null;

    return this._encoder.decode(item);
  }

  async save(data: T): Promise<void> {
    const encodeData = await this._encoder.encode(data);
    localStorage.setItem(this._storageKey, encodeData);
  }
}
