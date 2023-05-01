export interface IStorage<T> {
  load(): Promise<T | null>;
  save(data: T): Promise<void>;
}
