import { isDevelopment, isLocalPlay } from '$libs';
import { detectStorage, getManagers, initManagers } from '$share';
import { config } from './config';
import { initializePlugin } from './initializePlugin';
import { launch } from './launch';

export function main(params: g.GameMainParameterObject) {
  // マネージャーを初期化する
  g.game.vars.managers = initManagers({
    storage: detectStorage({
      gameKey: config.storage.gameKey,
    }),
  });

  // 初期化
  initializePlugin();

  // ロードシーンの差し替えをする場合はここで定義
  // g.game.loadingScene = new MyCustomLoadingScene({
  //   // explicitEnd: true,
  //   game: g.game,
  // });

  // 起動環境ごとの初期化処理を行う
  if (isLocalPlay()) {
    setupLocalPlay().then(() => {
      startLaunchScene(params);
    });
  } else {
    // それ以外の環境（＝ニコ生）では個別セットアップなし
    startLaunchScene(params);
  }
}

/**
 * 起動メッセージを受け取るシーンの起動
 */
function startLaunchScene(params: g.GameMainParameterObject) {
  const scene = new g.Scene({ game: g.game });
  scene.onMessage.add((msg: g.MessageEvent) => {
    if (!msg.data) return;
    if (msg.data.type !== 'start') return;
    if (isDevelopment()) console.log(params, msg.data.parameters);

    launch({ gameParams: params, launchParams: msg.data.parameters });
  });
  g.game.pushScene(scene);
}

// ローカル向けの初期化処理
async function setupLocalPlay() {
  const { SaveManager } = getManagers();

  // 環境に応じて非同期の初期化処理が必要な場合はここで行う
  const [saveData] = await Promise.all([SaveManager.storage.load()]);

  if (isDevelopment()) {
    console.log('[saveData]', saveData);
  }

  SaveManager.importData(saveData ?? {});
}
