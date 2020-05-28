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

//Get Todays Date
const getTodaysDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  if(mm.charAt(0) === '0') {
    // to suit the format of logs
    mm = mm.substr(1);
  }
  const yyyy = today.getFullYear();
  return mm + '/' + dd + '/' + yyyy;
}
// Read file and iterate through it
const fs = require('fs');
const searchLogs = function(filePath, date = getTodaysDate(), level = null, message = null) {
  return new Promise(function(resolve, reject) {
    if(filePath != null){
      //const filePath = path.join(__dirname, fileName);
      fs.readFile(filePath, (err,data) => {
        if(err) {
          console.log("__dirname: " + __dirname);
          console.log('error reading file', err)
          return reject;
        } else {
          //Logs divided into an array
          const data_iterated = data.toString().split('\n');
          // last element is an empty string due to \n
          data_iterated.pop()
          //String array converted to Json objects array
          const json_array_data = data_iterated.map(log => JSON.parse(log))
          // logs are filtered according to date
          const date_filtered_results = json_array_data.filter(log => {
            return log.timestamp.includes(date)
          })
          // Adding level filter
          let level_filtered = levelFilterLogs(date_filtered_results, level);
          // Adding Message Filter
          let message_filtered = messageFilterLogs(level_filtered, message);
          return resolve(message_filtered);
        }
      });
    } else {
      return reject;
    }
  })
}
const levelFilterLogs = (logArray, levelArray = null) => {
  // Adding level filter
  let level_filtered = []
  let level_filter_object = {};
  if(levelArray != null) {
    for(let i = 0; i < levelArray.length; i++) {
      //objects added to global in order to create dynamically
      level_filter_object['level_filtered' + i] = logArray.filter((log) => {
        return log.level.includes(levelArray[i])
      })
    }
    for(let i = 0; i < levelArray.length; i++) {
      if(`level_filtered${i}` in level_filter_object){
        level_filtered = level_filtered.concat(level_filter_object[`level_filtered${i}`]);
      }
    }
  } else {
    //no level filtered
    level_filtered = logArray;
  }
  return level_filtered
}
const messageFilterLogs = (logArray, message = null) => {
  let message_filtered;
  if(message != null) {
      message_filtered = logArray.filter((log) => {
          return log.message.includes(message)
      })
  } else {
      // no message filtered 
      message_filtered = logArray;
  }
  return message_filtered;
}
searchLogs('./combined.log', '5/28/2020' ,['warn', 'error'], 'for').then(data => console.log('method results',data));

const timezoned = () => {
  return new Date().toLocaleString('en-US', {
    timeZone: 'Europe/Moscow',
    hour12: false
  });
};

const logFormat = winston.format.combine(
  // winston.format.colorize(),
  winston.format.timestamp({
    format: timezoned
  }),
  winston.format.json(),
  winston.format.align(),
  // winston.format.printf(
  //   info => `${info.timestamp} ${info.level}: ${info.message}`
  // )
)


const logger = winston.createLogger({
  format: logFormat,
   transports: [
    // new winstonDailyRotateFile({
    //  filename: './logs/custom-%DATE%.log',
    //  dataPattern: 'YYYY-MM-DD',
    //  level: 'info'
    // }), 
    new winston.transports.File({
      filename: 'combined.log',
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

    const options = {
      // from: new Date() - (24 * 60 * 60 * 1000),
      // until: new Date(),
      limit: 5,
      start: 0,
      order: 'desc',
      fields: ['message']
    };
    
    

    app.post('/logger', (req, res) => {
      // res.send('Hello World!')
      // logger.info('HELLO WORLD');
          logger.log(req.body.type, req.body.log)
          logger.query(options, function (err, results) {
            if (err) {
              /* TODO: handle me */
              throw err;
            }
          
            console.log('results', results);
          });
          return res.status(200).send();
    })

    app.post('/getLogs', (req, res) => {
      // console.log('BODY getLogs',req.body);
      // logger.info('hello');
      let date = req.body.date;
      if(date) {
        if(date[0] === '0') {date = date.substr(1)}
      }
// searchLogs('./combined.log', '5/28/2020' ,['warn', 'error'], 'for').then(data => console.log('method results',data));

searchLogs('./combined.log', date ,req.body.level, req.body.message).then(data => {
  // console.log('method results',data);
  // res.json(data);
  return res.status(200).json({data});
});

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
