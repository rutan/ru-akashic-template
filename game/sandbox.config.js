const config = {
  events: {
    // ブラウザプレイ用のビルド（PLiCyなど）で使用されるメッセージ
    localLaunch: [
      [
        32,
        null,
        ':akashic',
        {
          'type': 'start',
          'parameters': { 'mode': 'single', 'toripota': { 'isLocal': true } }
        }
      ]
    ]
  }
};

module.exports = config;
