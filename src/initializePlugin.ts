import * as HoverPlugin from '@akashic-extension/akashic-hover-plugin/lib/HoverPlugin';

/**
 * プラグインを手動登録する
 */
export function initializePlugin() {
  // マウスホバー
  if (!g.game.operationPluginManager.plugins[0]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    g.game.operationPluginManager.register(HoverPlugin as any, 0);
    g.game.operationPluginManager.start(0);
  }
}
