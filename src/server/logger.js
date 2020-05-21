const winston = require('winston');
// const winstonDailyRotateFile = require('winston-daily-rotate-file');

// import * as winston from 'winston';
// import BrowserConsole from 'winston-transport-browserconsole';
// import winstonDailyRotateFile from 'winston-daily-rotate-file';

// const logFormat = winston.format.combine(
//   winston.format.colorize(),
//   winston.format.timestamp(),
//   winston.format.align(),
//   winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
// );
// const logger = winston.createLogger({
//   transports: [
//     new BrowserConsole({
//       format: winston.format.simple(),
//       level: 'debug',
//       // filename: `./logs/custom-%DATE%.log`,
//       // datePatter: 'YYYY-MM-DD',
//       // level: 'info',
//     }),
//   ],
//   // format: logFormat,
// });
const logger = winston.createLogger({
  // level: 'info',
  // format: winston.format.json(),
  // defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.Console(),
    // new winston.transports.File({ filename: 'combined.log' }),
  ],
});

//   setLogData(log_data) {
//     this.log_data = log_data;
//   }
//   async info(message) {
//     this.logger.log('info', message);
//   }
//   async info(message, obj) {
//     this.logger.log('info', message, {
//       obj,
//     });
//   }
//   async debug(message) {
//     this.logger.log('debug', message);
//   }
//   async debug(message, obj) {
//     this.logger.log('debug', message, {
//       obj,
//     });
//   }
//   async error(message) {
//     this.logger.log('error', message);
//   }
//   async error(message, obj) {
//     this.logger.log('error', message, {
//       obj,
//     });
//   }

// export default logger;
