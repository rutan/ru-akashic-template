import { config } from '@/config';
import { isAtsumaruSoloPlay, isLocalPlay, isSandbox } from '@/libs';
import { initializePlugin } from './initializePlugin';
import { launch } from './launch';

export function main(_params: g.GameMainParameterObject) {
  initializePlugin();
  setupAtsumaruAPI();

  if (isSandbox()) {
    // akashic-sandbox の場合はモード設定がランキングの場合はセッションパラメータ待機、
    // それ以外の場合は1人プレイモードとして起動する
    if (config.game.launch_mode === 'ranking') {
      initForListenSessionParameter();
    } else {
      initForSingle();
    }
  } else if (isLocalPlay()) {
    // アツマール1人プレイなどのローカルHTML起動の場合は1人プレイモードとして起動する
    initForSingle();
  } else {
    // それ以外（ニコ生 / アツマールマルチ）の場合は設定に従って起動する
    switch (config.game.launch_mode) {
      case 'ranking': {
        initForListenSessionParameter();
        break;
      }
      case 'multi': {
        initForMulti();
        break;
      }
      default: {
        throw `unknown launch_mode : ${config.game.launch_mode}`;
      }
    }
  }
}

/**
 * 1人プレイモードとして即時起動する
 */
function initForSingle() {
  launch({
    mode: 'single',
  });
}

/**
 * マルチプレイモードとして即時起動する
 */
function initForMulti() {
  launch({
    mode: 'multi',
  });
}

/**
 * セッションパラメータの購読を開始し、
 * その内容に応じて起動する
 */
function initForListenSessionParameter() {
  const scene = new g.Scene({ game: g.game });
  scene.onMessage.add((msg) => {
    if (!msg.data) return;
    if (msg.data.type !== 'start') return;

    launch(msg.data.parameters || {});
  });
  g.game.pushScene(scene);
}

/**
 * アツマールAPIの設定
 * アツマールの1人プレイモード以外の環境ではスキップする
 */
function setupAtsumaruAPI() {
  if (!isAtsumaruSoloPlay()) return;

  const atsumaruAPI = window.RPGAtsumaru;
  if (!atsumaruAPI) return;
  if (!atsumaruAPI.popups) return;
  if (!atsumaruAPI.popups.setThanksSettings) return;

  const thanksSetting = config.atsumaru.thanksSetting;
  if (thanksSetting) {
    atsumaruAPI.popups.setThanksSettings({
      autoThanks: thanksSetting.autoThanks,
      thanksText: thanksSetting.thanks.text,
      thanksImage: thanksSetting.thanks.image,
      clapThanksText: thanksSetting.clap.text,
      clapThanksImage: thanksSetting.clap.image,
      giftThanksText: thanksSetting.gift.text,
      giftThanksImage: thanksSetting.gift.image,
    });
  }
}
