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
  connections.push([res, LIMIT]);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const tickFn = () => {
  setTimeout(() => {
    const today = new Date();
    const year = today.getUTCFullYear();
    const month = today.getUTCMonth();
    const day = today.getUTCDate();
    const hours = today.getUTCHours();
    const minutes = today.getUTCMinutes();
    const seconds = today.getUTCSeconds();

    // console.log(`Time: ${day}.${month}.${year} ${hours}:${minutes}:${seconds}`);

    connections = connections.filter(connection => {
      if (connection[1]-- > 0) {
        connection[0].write(`Time: ${day}.${month}.${year} ${hours}:${minutes}:${seconds}\n`);

        return true;
      } else {
        connection[0].write(`Goodbye time: ${day}.${month}.${year} ${hours}:${minutes}:${seconds}\n`);
        connection[0].end();

        return false;
      }
    });

    tickFn();
  }, DELAY);
};

tickFn();