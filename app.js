const http = require('http');
require('dotenv').config();

const hostname = '127.0.0.1';
const port = 3000;

const DELAY = process.env.DELAY;
const LIMIT = process.env.LIMIT;

let connections = [];

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");
  connections.push(res);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

let tick = 0;
setTimeout(function run() {
  const today = new Date();
  const year = today.getUTCFullYear();
  const month = today.getUTCMonth();
  const day = today.getUTCDate();
  const hours = today.getUTCHours();
  const minutes = today.getUTCMinutes();
  const seconds = today.getUTCSeconds();

  console.log(`Time: ${day}.${month}.${year} ${hours}:${minutes}:${seconds}`);
  if (++tick > LIMIT) {
    connections.map(res => {
      res.write(`Goodbye time: ${day}.${month}.${year} ${hours}:${minutes}:${seconds}\n`);
      res.end();
    });
    connections = [];
    tick = 0;
  }
  connections.map((res, i) => {
    res.write(`USER#${i}! Time: ${day}.${month}.${year} ${hours}:${minutes}:${seconds}.\n`);
  });
  setTimeout(run, DELAY);
}, DELAY);