import { Connection, Channel, ConfirmChannel } from 'amqplib';
import uuid from 'uuid';
import * as _ from 'lodash';
import { MessageTopicPayload, TopicProcessResult } from '.';
import { Logger } from '../logging';

export async function sendToExchange<T>(exchangeName: string, routingKey: string, message: T, connection: Connection): Promise<any> {
  if (_.isNil(exchangeName)) {
    throw new Error('Exchange name cannot be empty');
  }

  if (!TopicClient.channel) {
    try {
      TopicClient.channel = await connection.createConfirmChannel();
    } catch (err) {
      Logger.instance.error(err);
      throw new Error('Channel has not been initialized');
    }
  }

  try {
    const ok = await TopicClient.channel.assertExchange(exchangeName, 'direct', { durable: true });

    return TopicClient.channel.publish(ok.exchange, routingKey, Buffer.from(JSON.stringify(message)), { persistent: true }, err => {
      if (err) {
        Logger.instance.error(err);
      } else {
        Logger.instance.info(`Message for ${exchangeName} has been sent. Payload: ${JSON.stringify(message)}`);
      }
    });
  } catch (error) {
    Logger.instance.error({ error, message: `Message for ${exchangeName} failed to send. Payload: ${JSON.stringify(message)}` });
  }
}

export async function consumeExchange<T>(exchangeName: string, routingKey: string, queueName: string, connection: Connection, onConsume: (payload: MessageTopicPayload<T>) => Promise<TopicProcessResult>): Promise<any> {
  if (_.isNil(connection)) {
    throw new Error(`Invalid connection when trying to consume ${exchangeName}:${queueName}`);
  }

  if (!TopicClient.channel) {
    try {
      TopicClient.channel = await connection.createConfirmChannel();
    } catch (err) {
      Logger.instance.error(err);
      throw new Error('Channel has not been initialized');
    }
  }

  if (_.isNil(routingKey)) {
    routingKey = '';
  }

  if (_.isNil(queueName)) {
    queueName = uuid();
  }

  const okExchange = await TopicClient.channel.assertExchange(exchangeName, 'direct', { durable: true });
  if (!okExchange || !okExchange.exchange) {
    throw new Error(`Exchange ${exchangeName} does not exist and failed to create on demand`);
  }

  const ok = await TopicClient.channel.assertQueue(queueName, { durable: false });
  try {
    await TopicClient.channel.bindQueue(queueName, okExchange.exchange, routingKey);
  } catch (error) {
    Logger.instance.error({ error, message: `Failed to bind queue ${queueName} to exchange ${exchangeName}` });
  }

  return await TopicClient.channel.consume(ok.queue, async message => {
    if (!message) {
      Logger.instance.error(`Message for ${exchangeName}:${queueName} has been consumed but failed to generate a response.`);
      return;
    }

    const content = JSON.parse(message!.content.toString()) as T;

    if (!_.isNil(onConsume)) {
      const messagePayload = new MessageTopicPayload<T>(queueName, exchangeName, content);

      const processingResult = await onConsume(messagePayload);
      switch (processingResult) {
        case TopicProcessResult.SuccessAndAcknowledge:
          Logger.instance.info(`Message for ${exchangeName}:${queueName} consumed successfully. Payload: ${JSON.stringify(messagePayload)}`);
          TopicClient.channel.ack(message, false);
          break;
        case TopicProcessResult.FailAndRetry:
          Logger.instance.info(`Message for ${exchangeName}:${queueName} failed and will be requeued. Payload: ${JSON.stringify(messagePayload)}`);
          TopicClient.channel.nack(message, false, true);
          break;
        default:
          Logger.instance.info(`Message for ${exchangeName}:${queueName} failed and aborting. Payload: ${JSON.stringify(messagePayload)}`);
          TopicClient.channel.nack(message, false, false);
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
  public static channel: ConfirmChannel;

  public static async init(connection: Connection): Promise<TopicClient> {
    this.connection = connection;

    if (!this.instance) {
      this.instance = new TopicClient();
    }

    this.channel = await connection.createConfirmChannel();
    return this.instance;
  }

  public sendToExchange<T>(exchangeName: string, routingKey: string, message: T): Promise<any> {
    return sendToExchange<T>(
      exchangeName,
      routingKey,
      message,
      TopicClient.connection
    );
  }

  public consumeExchange<T>(exchangeName: string, routingKey: string, queueName: string, onConsume: (payload: MessageTopicPayload<T>) => Promise<TopicProcessResult>): Promise<any> {
    return consumeExchange<T>(
      exchangeName,
      routingKey,
      queueName,
      TopicClient.connection,
      onConsume
    );
  }
}
