import { createTween as createTweenOriginal, type Group } from '@rutan/frame-tween';

type Truthy<T> = T extends undefined | null | false | 0 | '' ? never : T;

export function truthy<T>(n: T): n is Truthy<T> {
  return !!n;
}

export function nonNullable<T>(n: T): n is NonNullable<T> {
  return n !== null;
}

export function clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

interface ModifiableObject {
  parent: g.E | null;
  modified: () => void;
}

export function isModifiableObject(obj: unknown): obj is ModifiableObject {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'parent' in obj &&
    'modified' in obj &&
    typeof obj.modified === 'function'
  );
}

export function createTween<T>(obj: T, group: Group, params?: Partial<T>) {
  const tween = createTweenOriginal(obj, group, params);
  if (isModifiableObject(obj)) {
    tween.addUpdateListener(() => {
      if (obj.parent) obj.modified();
    });
  }

  return tween;
}

type Delim = '_' | '-' | ' ';
type UpperCamel<S extends string> = S extends `${infer Head}${Delim}${infer Tail}`
  ? `${Capitalize<Head>}${UpperCamel<Tail>}`
  : Capitalize<S>;

export function toUpperCamelCase<S extends string>(str: S): UpperCamel<S> {
  return str.replace(/(?:^|[-_ ])(\w)/g, (_, c) => c.toUpperCase()) as UpperCamel<S>;
}

export function openUrl(url: string) {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank');
  } else {
    console.warn('openUrl is not supported in this environment');
  }
}
