const config = {
  events: {
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
