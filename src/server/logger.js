import moment from 'moment';

export function log() {
  const date = moment(new Date()).format('DD.MM.YYYY hh:mm:ss');
  let textToLog = `${date}: `;
  for (let i = 0; i < arguments.length; i++) {
    textToLog = `${textToLog} ${arguments[i]}`;
  }
  console.log(textToLog);
}
