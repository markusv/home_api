import moment from 'moment';
import Winston from 'winston';

const formatter = (options) => {
  const date = moment(new Date()).format('DD.MM.YYYY HH:mm:ss');
  const message = options.message ? options.message : '';
  return `${date}: ${message}`;
};

const logger = new (Winston.Logger)({
  level: 'verbose',
  transports: [
    new (Winston.transports.Console)({
      formatter
    }),
    new (Winston.transports.File)({
      filename: 'futurehome.log',
      timestamp: true,
      maxsize: 1000000,
      maxFiles: 10,
      json: false,
      formatter,
      tailable: true
    })
  ]
});

export function log() {
  let textToLog = '';
  for (let i = 0; i < arguments.length; i++) {
    textToLog = `${textToLog} ${arguments[i]}`;
  }
  logger.log('info', textToLog);
}
