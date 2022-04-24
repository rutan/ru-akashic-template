/**
 * 本番モードであるか？
 */
export function isProduction() {
  return process.env.NODE_ENV === 'production';
}

/**
 * 開発中モードであるか？
 */
export function isDevelopment() {
  return !isProduction();
}

/**
 * ローカル実行であるか？
 * @note アツマール上での1人プレイもローカル実行として扱う
 */
export function isLocalPlay() {
  return isSandbox() || isAtsumaruSoloPlay() || isLocalHtml();
}

/**
 * アツマール上での1人プレイであるか？
 */
export function isAtsumaruSoloPlay() {
  if (typeof window === 'undefined') return false;
  return !!window.RPGAtsumaru;
}

/**
 * akashic-sandbox上での実行であるか？
 * @note あくまで簡易的なチェックのため将来的に動かなくなるかも
 */
export function isSandbox() {
  if (typeof document === 'undefined') return false;
  return document.title.startsWith('akashic-sandbox');
}

/**
 * ローカル用HTML上での実行であるか？
 */
export function isLocalHtml() {
  return typeof window !== 'undefined' && 'Toripota' in window;
}

/**
 * アツマールのマルチプレイ画面であるか？
 * @note あくまで簡易的なチェックのため将来的に駄目になるかも
 */
export function isAtsumaruMultiClient() {
  // resolve-player-info の力でアツマールの場合は生えてるはず
  return !!(g.game.external && g.game.external.atsumaru);
}
