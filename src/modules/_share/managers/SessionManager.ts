import type { LaunchParameter } from '../types';

/**
 * ゲーム起動中のみ保持するデータを管理するクラス
 */
export class SessionManager {
  private _launchParameter: LaunchParameter = {
    service: 'nicolive',
    mode: 'single',
    totalTimeLimit: undefined,
    randomSeed: undefined,
    difficulty: undefined,
  };

  /**
   * ゲーム起動時のパラメータ
   */
  get launchParameter() {
    return this._launchParameter;
  }

  set launchParameter(param: LaunchParameter) {
    this._launchParameter = param;
  }
}
