import path from 'path';
import http from 'http';
import express from 'express';
import reload from 'reload';
import reactDom from 'react-dom/server';
import React from 'react';
import { ServerStyleSheet } from 'styled-components';
import pkg from '../package.json';

const app = express();
const port = process.env.PORT || 81;
let isRunningServer = false;

const GLOBAL_STATE = {
    text: 'Deneme'
  };

  const layout = {
    head: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${pkg.name} Fragment</title>
      <script>var GLOBAL_STATE = ${JSON.stringify(GLOBAL_STATE)}</script>
  </head>
  <body>
      <div id="root">`,
    foot: `</div>
    <script src="${pkg.name}.js"></script>
    <script src="/reload/reload.js"></script> 
  </body>
  </html>
  `
  }

  app.use(express.static(path.resolve(__dirname, 'public')))

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Transfer-Encoding', 'chunked')

  delete require.cache[require.resolve('./app')]
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Application = require('./app')

  const sheet = new ServerStyleSheet()
  const jsx = sheet.collectStyles(<Application state={GLOBAL_STATE} />)
  console.info('JSX', jsx);
  const bodyStream = sheet.interleaveWithNodeStream(reactDom.renderToNodeStream(jsx))
  console.info('bodyStream', bodyStream);

  res.write(layout.head)

  bodyStream.on('data', chunk => res.write(chunk))

  bodyStream.on('error', err => {
    console.error('react render error:', err)
  })

  bodyStream.on('end', () => {
    res.write(layout.foot)
    res.end()
  })
})

const httpServer = http.createServer(app)

httpServer.listen(port, function () {
    console.info(`Web server listening on port ${port}`)
  })