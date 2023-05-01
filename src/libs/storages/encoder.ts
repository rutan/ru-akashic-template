export interface Encoder<T> {
  encode(data: T): Promise<string>;
  decode(str: string): Promise<T>;
}

export function createJsonEncoder<T>(): Encoder<T> {
  return {
    encode(data: T) {
      return Promise.resolve(JSON.stringify(data));
    },
    decode(str: string) {
      return Promise.resolve(JSON.parse(str));
    },
  };
}
