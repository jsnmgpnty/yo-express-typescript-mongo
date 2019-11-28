import express from 'express';
import { Application } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';
import os from 'os';
import cookieParser from 'cookie-parser';

import dotenv from 'dotenv';
dotenv.config();

import { DbConnection } from '../api/database';
import { Logger } from '../api/logging';
import { TopicClient, getConnection } from '../api/messaging';
import { StorageService } from '../api/services';
import { CryptoService } from '../api/utils';
import { RegisterRoutes } from '../routes';
const app = express();

export default class ExpressServer {
  constructor() {
    if (!process || !process.env) {
      throw new Error('failed to start express application');
    }

    // server setup
    const root = path.normalize(__dirname + '/../..');
    app.set('appPath', root + 'client');
    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(
      bodyParser.urlencoded({
        extended: true,
        limit: process.env.REQUEST_LIMIT || '100kb',
      })
    );
    app.use(bodyParser.text({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(express.static(`${root}/public`));

    // database setup
    DbConnection.connect(process.env.mongodb_connection);

    // logging setup
    const logger = Logger.init(
      process.env.logstash_host,
      parseInt(process.env.logstash_port)
    );
    Logger.instance = logger;

    // cryptography setup
    CryptoService.init(
      process.env.CRYPTO_SECRET || 'RZQtrYK1Ve4gZuhR64EwzZyxseAArkZ8'
    );

    // rabbitmq setup
    getConnection(
      process.env.rabbitmq_host,
      process.env.rabbitmq_username,
      process.env.rabbitmq_password,
      parseInt(process.env.rabbitmq_port)
    ).then(result => {
      TopicClient.init(result);
    });

    // storage setup
    StorageService.init(
      process.env.azure_storage_connection_string,
      process.env.azure_storage_account_name,
      process.env.azure_storage_access_key
    );
  }

  router(): ExpressServer {
    RegisterRoutes(app);
    return this;
  }

  listen(p: string | number = process.env.PORT): Application {
    const welcome = port => () => Logger.instance.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} on port: ${port}}`);
    http.createServer(app).listen(p, welcome(p));
    return app;
  }
}
