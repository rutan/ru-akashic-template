import { getManagers, type LaunchParameter } from '$share';
import { SceneManager } from './SceneManager';

/**
 * ゲーム起動時に呼び出される関数
 */
export function launch({ launchParams }: { gameParams: g.GameMainParameterObject; launchParams: LaunchParameter }) {
  // 乱数のシード値が指定されている場合はセットする
  if (launchParams.randomSeed !== undefined) g.game.random.seed = launchParams.randomSeed;

  // gameStateを初期化
  g.game.vars.gameState = {
    score: 0,
    // playThreshold: 1,
  };

  // 起動パラメータを保存
  const { SessionManager } = getManagers();
  SessionManager.launchParameter = launchParams;

  // 以下、自由にゲームを作ろう！
  SceneManager.changeScene('title');
}
