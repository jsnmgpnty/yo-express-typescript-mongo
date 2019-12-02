import {
  ConsoleTransportOptions,
  FileTransportOptions,
} from 'winston/lib/winston/transports';

export default interface LoggerOptions {
  file?: FileTransportOptions;
  console?: ConsoleTransportOptions;
  logstash?: { host: string, port: number, mode: 'tcp' | 'udp' };
}
