import path from 'path'
import http from 'http'
import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import reload from 'reload'
import React from 'react'
import compression from 'compression'
import { renderToNodeStream } from 'react-dom/server'
import { StaticRouter, matchPath } from 'react-router-dom'
import { ServerStyleSheet } from 'styled-components'
import serialize from 'serialize-javascript'
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from '@apollo/react-common';

import { getDataFromTree } from "@apollo/react-ssr";


import pkg from '../../package.json'
import App from '../shared/App'
import routes from '../shared/routes'

// import * as winston from 'winston';
const winston = require('winston');
const winstonDailyRotateFile = require('winston-daily-rotate-file');

import BrowserConsole from 'winston-transport-browserconsole';

const app: Application = express()
const port = process.env.PORT || 81
const isProd = process.env.NODE_ENV === 'production'
const publicPath = path.join(__dirname, 'public')
const server = http.createServer(app)

const logFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  winston.format.printf(
    info => `${info.timestamp} ${info.level}: ${info.message}`
  )
)


const logger = winston.createLogger({
  format: logFormat,
   transports: [
    new winstonDailyRotateFile({
     filename: './logs/custom-%DATE%.log',
     dataPattern: 'YYYY-MM-DD',
     level: 'info'
    }), 
     new winston.transports.Console({level: 'info'})]
  }) 

// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.json(),
//   defaultMeta: { service: 'user-service' },
//   transports: [
//     //
//     // - Write all logs with level `error` and below to `error.log`
//     // - Write all logs with level `info` and below to `combined.log`
//     //
//     new winston.transports.File({ filename: 'error.log', level: 'error' }),
//     new winston.transports.File({ filename: 'combined.log' })
//   ]
// });
const level = "debug";
// const logger = winston.createLogger({
//   // level: 'info',
//   // format: winston.format.json(),
//   // defaultMeta: { service: 'user-service' },
//   transports: [
//     //
//     // - Write all logs with level `error` and below to `error.log`
//     // - Write all logs with level `info` and below to `combined.log`
//     //
//     // new winston.transports.Console(),
//     // new winston.transports.File({ filename: 'combined.log' }),
//     new BrowserConsole(
//       {
//           format: winston.format.simple(),
//           level,
//       },
//   ),
//   ],
// });

// logger.info('YEEAAAAHHH');



app.use(cors())

isProd && app.use(compression())

app.use(express.static(publicPath))
app.use(express.json());

const paths = routes.map(({ path }) => path)

if(isProd) {
   app.get(paths, async (req: Request, res: Response, next) => {
    console.log('Req', req);
      res.setHeader('Content-Type', 'application/json')

      const fragment = {
        name: pkg.name,
        version: pkg.version,
        html: ''
      }

      const activeRoute = routes.find(route => matchPath(req.url, route)) || {}

      const data = activeRoute.fetchInitialData
        ? await activeRoute.fetchInitialData(req.path)
        : await Promise.resolve({})

      try {
        const sheet = new ServerStyleSheet()
        const markup = sheet.collectStyles(
          <StaticRouter location={req.url} context={data && data.context}>
            <App />
          </StaticRouter>
        )

        const bodyStream = sheet.interleaveWithNodeStream(renderToNodeStream(markup))

        fragment.html = `<script>window.__INITIAL_DATA__ = ${serialize(data)}</script><div>`
        res.write(JSON.stringify(fragment))

        bodyStream.on('data', chunk => {
          fragment.html = chunk
          res.write(JSON.stringify(fragment))
        })

        bodyStream.on('end', () => {
          fragment.html = `</div>`
          fragment.script = `${pkg.name}.js`
          res.write(JSON.stringify(fragment))
          res.end()
        })

        bodyStream.on('error', err => {
          console.error('react render error:', err)
        })
      } catch (error) {
        next(error)
      }
    }) 
  }
  else {
    app.get(paths, async (req: Request, res: Response, next) => {
    console.log('REQ', paths);
      res.setHeader('Content-Type', 'text/html; charset=utf-8')

      const activeRoute = routes.find(route => matchPath(req.url, route)) || {}

      const data = activeRoute.fetchInitialData
        ? await activeRoute.fetchInitialData(req.path)
        : await Promise.resolve({})

      try {
        const { context } = data
        // console.log('Context True/False', activeRoute.fetchInitialData);
        // console.log('DATA', context);
        const client = new ApolloClient({
          ssrMode: true,
          // Remember that this is the interface the SSR server will use to connect to the
          // API server, so we need to ensure it isn't firewalled, etc
          link: createHttpLink({
            uri: 'http://localhost:81',
            credentials: 'same-origin',
            headers: {
              cookie: req.header('Cookie'),
            },
          }),
          cache: new InMemoryCache(),
        });

        const sheet = new ServerStyleSheet()
        const markup = sheet.collectStyles(
          <ApolloProvider client={client}>
            <StaticRouter location={req.url} context={data.context}>
              <App />
            </StaticRouter>
          </ApolloProvider>
        )

        getDataFromTree(markup).then(() => {
          // We are ready to render for real
          const content = sheet.interleaveWithNodeStream(renderToNodeStream(markup));
          const initialState = client.extract();
          console.log('INITIALSTATE', initialState)

          res.write(`<!DOCTYPE html>
       <html>
         <head>
           <title>${pkg.name} v${pkg.version}</title>
           <script>window.__INITIAL_DATA__ = ${serialize(data)}</script>
      
         </head>
         <body>
           <div id="root">
           <script dangerouslySetInnerHTML={{
            __html: window.__APOLLO_STATE__=${JSON.stringify(initialState).replace(/</g, '\\u003c')};,
          }} />`)

      content.on('data', chunk => res.write(chunk))

      content.on('end', () => {
          res.write(`</div>
          <script src="/reload/reload.js"></script>
          <script src="/${pkg.name}.js"></script>
        </body>
      </html>`)
          res.end()
        })

        content.on('error', err => {
          console.error('react render error:', err)
        })
        
        });
      //   const bodyStream = sheet.interleaveWithNodeStream(renderToNodeStream(markup))

      //   res.write(`<!DOCTYPE html>
      // <html>
      //   <head>
      //     <title>${pkg.name} v${pkg.version}</title>
      //     <script>window.__INITIAL_DATA__ = ${serialize(data)}</script>
      //   </head>
      //   <body>
      //     <div id="root">`)

      //   bodyStream.on('data', chunk => res.write(chunk))

      //   bodyStream.on('end', () => {
      //     res.write(`</div>
      //     <script src="/reload/reload.js"></script>
      //     <script src="/${pkg.name}.js"></script>
      //   </body>
      // </html>`)
      //     res.end()
      //   })

        // bodyStream.on('error', err => {
        //   console.error('react render error:', err)
        // })
      } catch (error) {
        next(error)
      }
    })

    app.post('/logger', (req, res) => {
      // res.send('Hello World!')
      // logger.info('HELLO WORLD');
      console.log('REQ', req.body)
          logger.log(req.body.type, req.body.log)
    })
  }

app.get('*', (req: Request, res: Response) => res.send(''))

const runHttpServer = async (): Promise => {
  try {
    await reload(app)
    server.listen(port, () => {
      console.log(`Server is listening on port: ${port}`)
    })
  } catch (err) {
    console.error('Reload could not start, could not start server/sample app', err)
  }
}

runHttpServer()

// module.exports = {logger};
