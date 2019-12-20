import * as _ from 'lodash';
import { Example } from '../models';
import { ExampleSchemaModel } from '../schema';
import { BaseService } from '.';

class ExampleService extends BaseService<Example> {
  constructor(user) {
    super(user);
  }
}

const ExampleServiceInstance = new ExampleService(ExampleSchemaModel);

export { ExampleServiceInstance as ExampleService };
