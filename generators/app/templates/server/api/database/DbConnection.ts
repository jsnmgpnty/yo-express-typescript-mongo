import { connect, Connection, connection } from 'mongoose';
import { Logger } from '../logging';

class DbConnection {
  public static mongooseInstance: Connection;

  public static async connect(connectionString: string): Promise<Connection> {
    if (this.mongooseInstance) {
      return this.mongooseInstance;
    }

    const db = connection;
    await connect(connectionString);

    db.on('error', error => Logger.instance.error(error));
    db.once('open', () =>
      Logger.instance.info(
        `Connected to mongo database with connection string ${connectionString}`
      )
    );

    this.mongooseInstance = db;
    return this.mongooseInstance;
  }
}

export { DbConnection };
