// https://github.com/akashic-games/akashic-sandbox/blob/main/index.js

const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const express = require('express');

const gameBase = './game';
const port = Number(process.env.PORT || 3000);

const app = express();
app.use('/game', express.static(path.join(__dirname, '../static')));

const akashicApp = require('@akashic/akashic-sandbox/lib/app')({ gameBase: gameBase });
akashicApp.set('port', port);
app.use(akashicApp);

const gameJsonPath = path.join(akashicApp.gameBase, 'game.json');
if (!fs.existsSync(gameJsonPath)) {
  console.error(`can not load ${path.join(app.gameBase, 'game.json')}`);
  process.exit(1);
}

const server = http.createServer(app);

server.listen(port);
console.log('please access to http://localhost:%d/game/ by web-browser', port);
