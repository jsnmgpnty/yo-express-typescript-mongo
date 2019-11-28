import * as _ from 'lodash';

export class ErrorInfo {
  public errorType?: string;
  public message?: string;

  constructor(errorType?: string, message?: string) {
    if (!_.isNil(errorType)) {
      this.errorType = errorType;
    }

    if (!_.isNil(message)) {
      this.message = message;
    }
  }
}
