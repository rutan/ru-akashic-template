import * as HoverPlugin from '@akashic-extension/akashic-hover-plugin/lib/HoverPlugin';
import { RightClickPlugin } from '@rutan/akashic-right-click-plugin';

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

  // 右クリック
  if (!g.game.operationPluginManager.plugins[1]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    g.game.operationPluginManager.register(RightClickPlugin, 1);
    g.game.operationPluginManager.start(1);
  }
}
