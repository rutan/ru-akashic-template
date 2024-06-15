import { isDevelopment, isLocalPlay, isSandbox } from '$libs';
import { SaveManager } from '$share';
import { config } from './config';
import { initializePlugin } from './initializePlugin';
import { type LaunchParameter, launch } from './launch';

export function main(params: g.GameMainParameterObject) {
  // 初期化
  SaveManager.setup(config.storage.prefix, {});
  initializePlugin();
  setupSandbox();

  // 起動メッセージを受け取るためのシーンを作成する
  const scene = new g.Scene({ game: g.game });
  scene.onMessage.add((msg: g.MessageEvent) => {
    if (!msg.data) return;
    if (msg.data.type !== 'start') return;
    if (isDevelopment()) console.log(params, msg.data.parameters);

    if (isLocalPlay()) {
      setupLocalPlay({ gameParams: params, launchParams: msg.data.parameters });
    } else {
      launch({ gameParams: params, launchParams: msg.data.parameters });
    }
  });
  g.game.pushScene(scene);
}

/**
 * ローカルプレイ用の初期化処理
 * セーブデータの読み込みを行う
 */
function setupLocalPlay({
  gameParams,
  launchParams,
}: { gameParams: g.GameMainParameterObject; launchParams: LaunchParameter }) {
  const SAVE_LOAD_EVENT_NAME = '__setupLocalPlay__';

  const saveLoadScene = new g.Scene({ game: g.game, tickGenerationMode: 'manual' });
  saveLoadScene.onMessage.add((msg: g.MessageEvent) => {
    if (!msg.data) return;
    if (msg.data.type !== SAVE_LOAD_EVENT_NAME) return;
    SaveManager.importData(msg.data.saveData);
    launch({ gameParams, launchParams });
  });

  saveLoadScene.onLoad.add(() => {
    SaveManager.storage.load().then((saveData) => {
      g.game.raiseTick([
        new g.MessageEvent({
          type: SAVE_LOAD_EVENT_NAME,
          saveData,
        }),
      ]);
    });
  });

  g.game.pushScene(saveLoadScene);
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
      container.style.top = '30px';
    } else {
      container.style.top = '0';
    }
  };
  resizeFunc();
  window.addEventListener('resize', resizeFunc);
}
