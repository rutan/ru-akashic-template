const packageJSON = require('./package.json');
const now = new Date();
const output = [
  '_dist/',
  now.getFullYear(),
  `${now.getMonth() + 1}`.padStart(2, '0'),
  `${now.getDate()}`.padStart(2, '0'),
  '-',
  `${now.getHours()}`.padStart(2, '0'),
  `${now.getMinutes()}`.padStart(2, '0'),
  `${now.getSeconds()}`.padStart(2, '0'),
  '-',
  packageJSON.version,
  '.zip',
].join('');

module.exports = {
  output,
  ignore: [
    // OS
    '.DS_Store',
    'Thumb.db',
    'Desktop.ini',
  ],
};
