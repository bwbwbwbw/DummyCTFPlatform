import winston from 'winston';
import moment from 'moment';

const timeFormatter = () => moment().format('YYYY-MM-DD HH:mm:ss Z');

export default (DI) => {

  const oplogger = new (winston.Logger)({
    exitOnError: false,
    transports: [
      new (winston.transports.File)({
        name: 'operation-log',
        filename: `${__projectRoot}/logs/operation.log`,
        level: 'debug',
        timestamp: timeFormatter,
      }),
    ],
  });
  oplogger.level = 'debug';
  return oplogger;

};
