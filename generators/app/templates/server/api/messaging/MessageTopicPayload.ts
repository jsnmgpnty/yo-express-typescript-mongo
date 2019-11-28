export class MessageTopicPayload<T> implements MessagePayload<T> {
  public topicName?: string;
  public exchange?: string;
  public payload?: T;

  constructor(topicName?: string, exchange?: string, payload?: T) {
    this.topicName = topicName;
    this.exchange = exchange;
    this.payload = payload;
  }
}

export interface MessagePayload<T> {
  topicName?: string;
  exchange?: string;
  payload?: T;
}
