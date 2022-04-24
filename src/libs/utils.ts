type Truthy<T> = T extends undefined | null | false | 0 | '' ? never : T;

export function truthy<T>(n: T): n is Truthy<T> {
  return !!n;
}

export function nonNullable<T>(n: T): n is NonNullable<T> {
  return n !== null;
}
