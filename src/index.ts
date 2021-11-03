import { isLocalHtml, isMultiPlay } from './libs/environments';
import { config } from './config';
import { initializePlugin } from './initializePlugin';
import { launch } from './launch';

export function main(_params: g.GameMainParameterObject) {
  initializePlugin();
  setupAtsumaruAPI();

  if (isLocalHtml()) {
    // アツマール1人プレイなどのローカルHTML起動の場合は即起動する
    launch({
      mode: 'single',
    });
  } else if (isMultiPlay()) {
    // マルチプレイ時も即起動する
    launch({
      mode: 'multi',
    });
  } else {
    // akashic-sandboxやニコ生上での起動の場合はセッションパラメータを待つ
    const scene = new g.Scene({ game: g.game });
    scene.onMessage.add((msg) => {
      if (!msg.data) return;
      if (msg.data.type !== 'start') return;

      launch(msg.data.parameters || {});
    });
    g.game.pushScene(scene);
  }
}

/**
 * アツマールAPIの設定
 * アツマールの1人プレイモード以外の環境ではスキップする
 */
function setupAtsumaruAPI() {
  if (typeof window === 'undefined') return;

  const atsumaruAPI = window.RPGAtsumaru;
  if (!atsumaruAPI) return;

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
