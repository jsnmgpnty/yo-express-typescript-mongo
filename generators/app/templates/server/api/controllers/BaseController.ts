import * as _ from 'lodash';
import { Controller } from 'tsoa';
import { ErrorInfo, EntityMetadata } from '../models';

export class BaseController extends Controller {
  sendErrorResponse<TResult>(errorType: string, statusCode: number): Promise<EntityMetadata<TResult>> {
    this.setStatus(statusCode);
    const error: ErrorInfo = new ErrorInfo(errorType);
    return Promise.resolve(new EntityMetadata<TResult>(null, error));
  }

  handleResponse<TResult>(results: EntityMetadata<TResult>, unhandledError: string, onHandleResponse: (result: EntityMetadata<TResult>) => void): Promise<EntityMetadata<TResult>> {
    if (!results) {
      return this.sendErrorResponse(unhandledError, 500);
    }

    if (results.error) {
      return this.sendErrorResponse(results.error.errorType, 500);
    }

    if (_.isFunction(onHandleResponse) && !_.isNil(onHandleResponse)) {
      onHandleResponse(results);
    }

    this.setStatus(200);
    return Promise.resolve(results);
  }
}
