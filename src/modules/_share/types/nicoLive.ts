/**
 * 起動時のパラメータ
 * @see https://akashic-games.github.io/shin-ichiba/spec.html
 */
export interface LaunchParameter {
  service?: 'nicolive' | string;
  mode?: 'single' | 'ranking' | 'multi';
  totalTimeLimit?: number;
  randomSeed?: number;
  difficulty?: number;
}
