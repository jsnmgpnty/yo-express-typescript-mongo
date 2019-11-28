import { LogstashOption } from 'winston-logstash-ts';
import {
  ConsoleTransportOptions,
  FileTransportOptions,
} from 'winston/lib/winston/transports';

export default interface LoggerOptions {
  file?: FileTransportOptions;
  console?: ConsoleTransportOptions;
  logstash?: LogstashOption;
}
