#!/usr/bin/env node

const path = require('path');
const http = require('http');
const url = require('url');
const qs = require('querystring');
const tree = require('./tree');
const template = require('./template');

const errorHandlerWrapper = (req, res) => {
  return function() {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end('file or directory not exist');
  }
}

const server = http.createServer((req, res) => {
  if (req.url === '/favicon.ico') {
    res.end();
    return;
  }

  const query = url.parse(req.url).query;
  const urlWithQuery = url.parse(req.url).pathname;
  const queryObj = qs.parse(query);


  console.log('-----');
  console.log(query);
  console.log(queryObj);
  console.log(urlWithQuery);
  console.log('-----');

  if (queryObj.download) {
    res.writeHead(200, {
      'Content-Disposition': `attachment; filename=${urlWithQuery}`
    });
    res.end(tree('./' + urlWithQuery, process.cwd()).fileContent);
  } else {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });
    res.end(template(tree('./' + urlWithQuery, process.cwd())));
  }

});

// start server
const port = process.env.PORT || 3000;
server.listen(port);
server.on('listening', () => {
  console.log('listening at port ' + port);
});
server.on('error', (e) => {
  console.error(e);
});