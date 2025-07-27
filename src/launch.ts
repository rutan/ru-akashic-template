import { SceneManager } from './SceneManager';

export interface LaunchParameter {
  service?: 'nicolive';
  mode?: 'single' | 'ranking' | 'multi';
  totalTimeLimit?: number;
  randomSeed?: number;
  difficulty?: number;
}

/**
 * ゲーム起動時に呼び出される関数
 */
export function launch({ launchParams }: { gameParams: g.GameMainParameterObject; launchParams: LaunchParameter }) {
  // 乱数のシード値が指定されている場合はセットする
  if (launchParams.randomSeed !== undefined) g.game.random.seed = launchParams.randomSeed;

  // 以下、自由にゲームを作ろう！
  SceneManager.changeScene('title');
}
