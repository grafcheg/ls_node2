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
    const UTCstring = today.toUTCString();

    connections = connections.filter(connection => {
      if (connection[1]-- > 0) {
        console.log(`Time: ${UTCstring}`);

        return true;
      } else {
        connection[0].write(`Goodbye time: ${UTCstring}\n`);
        connection[0].end();

        return false;
      }
    });

    tickFn();
  }, DELAY);
};

tickFn();