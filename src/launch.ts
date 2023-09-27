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
export function launch(params: LaunchParameter) {
  // 乱数のシード値が指定されている場合はセットする
  if (params.randomSeed !== undefined) g.game.random.seed = params.randomSeed;

  SceneManager.changeScene('title');
}
