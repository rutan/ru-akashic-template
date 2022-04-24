import { SceneManager } from './SceneManager';

export interface LaunchParameter {
  mode?: 'single' | 'ranking' | 'multi';
  totalTimeLimit?: number;
  gameTimeLimit?: number;
}

/**
 * ゲーム起動時に呼び出される関数
 */
export function launch(_params: LaunchParameter) {
  SceneManager.changeScene('title');
}
