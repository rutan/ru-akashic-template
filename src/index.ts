import { config } from '@/config';
import { isAtsumaruSoloPlay, isLocalPlay, isSandbox } from '@/libs';
import { initializePlugin } from './initializePlugin';
import { launch } from './launch';

export function main(_params: g.GameMainParameterObject) {
  initializePlugin();

  if (isSandbox()) {
    setupSandbox();

    // akashic-sandbox の場合はモード設定がランキングの場合はセッションパラメータ待機、
    // それ以外の場合は1人プレイモードとして起動する
    if (config.game.launch_mode === 'ranking') {
      initForListenSessionParameter();
    } else {
      initForSingle();
    }
  } else if (isLocalPlay()) {
    setupAtsumaruAPI();

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
