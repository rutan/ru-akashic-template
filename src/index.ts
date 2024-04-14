import { isDevelopment, isLocalPlay, isSandbox } from '$libs';
import { SaveManager } from '$share';
import { config } from './config';
import { initializePlugin } from './initializePlugin';
import { launch, LaunchParameter } from './launch';

export function main(_params: g.GameMainParameterObject) {
  // 初期化
  SaveManager.setup(config.storage.prefix, {});
  initializePlugin();
  setupSandbox();

  // 起動メッセージを受け取るためのシーンを作成する
  const scene = new g.Scene({ game: g.game });
  scene.onMessage.add((msg: g.MessageEvent) => {
    if (!msg.data) return;
    if (msg.data.type !== 'start') return;

    start(msg.data.parameters || {});
  });
  g.game.pushScene(scene);
}

/**
 * ゲーム開始処理
 * @param params
 */
function start(params: LaunchParameter) {
  if (isDevelopment()) console.log('launchParameter', params);

  if (isLocalPlay()) {
    // ローカル起動の場合はセーブデータを読み込む
    const scene = new g.Scene({ game: g.game });
    SaveManager.load(scene, () => {
      if (isDevelopment()) console.log('SaveManager', SaveManager.data);
      g.game.scenes.pop();
      launch(params);
    });
    g.game.scenes.push(scene);
  } else {
    // ニコ生プレイの場合はそのまま開始
    launch(params);
  }
}

/**
 * akashic-sandbox の設定
 * 主にスマートフォンからのデバッグのための設定を仕込む
 * akashic-sandbox 以外の環境ではスキップする
 */
function setupSandbox() {
  if (!isSandbox()) return;

  const container = document.getElementById('container');
  if (!container) return;

  // viewportの設定
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width,initial-scale=1';
  document.querySelector('head')?.append(meta);

  // resize設定
  container.style.position = 'absolute';
  const resizeFunc = () => {
    const rate = Math.min(window.screen.width / g.game.width, 1);
    container.style.transform = `scale(${rate})`;
    container.style.transformOrigin = 'left top';
    if (rate < 1.0) {
      container.style.top = `30px`;
    } else {
      container.style.top = '0';
    }
  };
  resizeFunc();
  window.addEventListener('resize', resizeFunc);
}
