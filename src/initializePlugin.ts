import { HoverPlugin } from '@akashic-extension/akashic-hover-plugin';

/**
 * プラグインを手動登録する
 */
export function initializePlugin() {
  // マウスホバー
  if (!g.game.operationPluginManager.plugins[0]) {
    g.game.operationPluginManager.register(HoverPlugin, 0);
    g.game.operationPluginManager.start(0);
  }
}
