/**
 * ローカル実行であるか？
 */
export function isLocalPlay() {
  return isSandbox() || isLocalHtml();
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
