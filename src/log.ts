
import config from './config'

const winston = require('winston');

const level = config.get('log_level')

const log = winston.createLogger({
  level,
  format: winston.format.json(),
  defaultMeta: { service: '' },
  transports: [
    new winston.transports.Console(),
  ],
});

export { log }
