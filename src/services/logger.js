import winston from 'winston';
import moment from 'moment';
import chalk from 'chalk';

const timeFormatter = () => moment().format('YYYY-MM-DD HH:mm:ss Z');

export default function (DI) {

  const logger = new (winston.Logger)({
    exitOnError: false,
    transports: [

      new (winston.transports.Console)({
        name: 'console',
        level: 'debug',
        json: false,
        colorize: true,
        timestamp: timeFormatter,
        handleExceptions: true,
        humanReadableUnhandledException: true,
      }),

      new (winston.transports.File)({
        name: 'debug-file-log',
        filename: `${__projectRoot}/logs/debug.log`,
        level: 'debug',
        timestamp: timeFormatter,
      }),

      new (winston.transports.File)({
        name: 'error-file-log',
        filename: `${__projectRoot}/logs/error.log`,
        level: 'warn',
        timestamp: timeFormatter,
        handleExceptions: true,
        humanReadableUnhandledException: true,
      }),

    ],
  });
  logger.level = 'debug';
  return logger;

}
