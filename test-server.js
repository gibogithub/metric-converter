// test-server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

let server = null;

app.prepare().then(() => {
  server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  server.listen(3001, (err) => {
    if (err) throw err;
    console.log('> Test server ready on http://localhost:3001');
  });
});

// Export for testing
module.exports = { app, server };