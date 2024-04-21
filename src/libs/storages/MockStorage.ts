import type { IStorage } from './IStorage';

export class MockStorage<T> implements IStorage<T> {
  load() {
    return Promise.resolve(null);
  }

  save(_data: T) {
    return Promise.resolve();
  }
}
