import * as _ from 'lodash';
import { ErrorInfo } from './ErrorInfo';

export class EntityMetadata<TEntity> {
  public data?: TEntity;
  public error?: ErrorInfo;

  constructor(data?: TEntity, error?: ErrorInfo) {
    if (!_.isNil(data)) {
      this.data = data;
    }

    if (!_.isNil(error)) {
      this.error = error;
    }
  }
}
