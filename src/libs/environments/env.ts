import { NODE_ENV } from '$constants';

/**
 * 本番モードであるか？
 */
export function isProduction() {
  return NODE_ENV === 'production';
}

/**
 * 開発中モードであるか？
 */
export function isDevelopment() {
  return !isProduction();
}
