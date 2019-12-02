import * as _ from 'lodash';
import * as winston from 'winston';
const WinstonLogStash = require('winston3-logstash-transport');

class Logger {
  public static instance: winston.Logger;

  public static init(
    logstashHost: string,
    logstashPort: number,
    logFilePath?: string,
    appName?: string
  ): winston.Logger {
    if (this.instance) {
      return this.instance;
    }

    let logger: winston.Logger = winston.createLogger();

    if (!_.isNil(logstashHost) && !_.isNil(logstashPort)) {
      logger.add(new WinstonLogStash({
        mode: 'tcp',
        host: logstashHost,
        port: logstashPort,
      }));
    }

    logger.exitOnError = false;
    logger.format = winston.format.combine(
      winston.format.json(),
      winston.format.timestamp()
    );

    logger.add(
      new winston.transports.Console({
        handleExceptions: true,
        level: 'debug',
      })
    );

    if (!_.isNil(logFilePath)) {
      logger.transports.push(
        new winston.transports.File({
          filename: logFilePath || '/logs/app.log',
          handleExceptions: true,
          level: 'info',
          maxFiles: 5,
          maxsize: 5242880, // 5MB
        })
      );
    }

    return logger;
  }
}

export { Logger };
