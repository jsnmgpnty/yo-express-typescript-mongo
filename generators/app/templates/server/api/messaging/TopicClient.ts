import { Connection } from 'amqplib';
import * as _ from 'lodash';
import { MessageTopicPayload, TopicProcessResult } from '.';
import { Logger } from '../logging';

export async function sendToExchange<T>(
  exchangeName: string,
  routingKey: string,
  message: T,
  connection: Connection
): Promise<any> {
  if (_.isNil(exchangeName)) {
    throw new Error('Exchange name cannot be empty');
  }

  try {
    const ch = await connection.createConfirmChannel();
    const ok = await ch.assertExchange(exchangeName, 'direct', {
      durable: false,
    });
    return ch.publish(
      ok.exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: true },
      err => {
        ch.close();

        if (err) {
          Logger.instance.error(err);
        } else {
          Logger.instance.info(
            `Message for ${exchangeName} has been sent. Payload: ${JSON.stringify(
              message
            )}`
          );
        }
      }
    );
  } catch (error) {
    Logger.instance.error({
      error,
      message: `Message for ${exchangeName} failed to send. Payload: ${JSON.stringify(
        message
      )}`,
    });
  } finally {
    connection.close();
  }
}

export async function consumeExchange<T>(
  exchangeName: string,
  routingKey: string,
  queueName: string,
  connection: Connection,
  onConsume: (payload: MessageTopicPayload<T>) => Promise<TopicProcessResult>
): Promise<any> {
  if (_.isNil(connection)) {
    throw new Error(
      `Invalid connection when trying to consume ${exchangeName}:${queueName}`
    );
  }

  const channel = await connection.createChannel();
  const ok = await channel.assertQueue(queueName, { durable: true });
  return await channel.consume(
    ok.queue,
    async message => {
      if (!message) {
        Logger.instance.error(
          `Message for ${exchangeName}:${queueName} has been consumed but failed to generate a response.`
        );
        return;
      }

      const content = JSON.parse(message!.content.toString()) as T;

      if (!_.isNil(onConsume)) {
        const messagePayload = new MessageTopicPayload<T>(
          queueName,
          exchangeName,
          content
        );

        const processingResult = await onConsume(messagePayload);
        switch (processingResult) {
          case TopicProcessResult.SuccessAndAcknowledge:
            Logger.instance.info(
              `Message for ${exchangeName}:${queueName} consumed successfully. Payload: ${JSON.stringify(
                messagePayload
              )}`
            );
            channel.ack(message, false);
            break;
          case TopicProcessResult.FailAndRetry:
            Logger.instance.info(
              `Message for ${exchangeName}:${queueName} failed and will be requeued. Payload: ${JSON.stringify(
                messagePayload
              )}`
            );
            channel.nack(message, false, true);
            break;
          default:
            Logger.instance.info(
              `Message for ${exchangeName}:${queueName} failed and aborting. Payload: ${JSON.stringify(
                messagePayload
              )}`
            );
            channel.nack(message, false, false);
            break;
        }
      }
    },
    { noAck: false }
  );
}

export class TopicClient {
  public static instance: TopicClient;
  public static connection: Connection;

  public static init(connection: Connection): TopicClient {
    this.connection = connection;

    if (!this.instance) {
      this.instance = new TopicClient();
    }

    return this.instance;
  }

  public sendToExchange<T>(
    exchangeName: string,
    routingKey: string,
    message: T
  ): Promise<any> {
    return sendToExchange<T>(
      exchangeName,
      routingKey,
      message,
      TopicClient.connection
    );
  }

  public consumeExchange<T>(
    exchangeName: string,
    routingKey: string,
    queueName: string,
    onConsume: (payload: MessageTopicPayload<T>) => Promise<TopicProcessResult>
  ): Promise<any> {
    return consumeExchange<T>(
      exchangeName,
      routingKey,
      queueName,
      TopicClient.connection,
      onConsume
    );
  }
}
