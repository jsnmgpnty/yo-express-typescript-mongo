import { connect, Connection } from 'amqplib';
import * as _ from 'lodash';

const getConnection = (
  host: string,
  username?: string,
  password?: string,
  port?: number
): Promise<Connection> => {
  let connectionString = '';

  if (!_.isNil(username) && !_.isNil(password)) {
    connectionString = `amqp://${username}:${password}@${host}`;
  } else {
    connectionString = `amqp://${host}`;
  }

  if (!_.isNil(port)) {
    connectionString += `:${port}`;
  }

  return connect(connectionString);
};

export { getConnection };
