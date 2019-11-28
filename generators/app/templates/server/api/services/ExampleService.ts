import * as _ from 'lodash';
import { Example } from '../models';
import { ExampleSchemaModel } from '../schema';
import { BaseService } from '.';

class UsersService extends BaseService<Example> {
  constructor(user) {
    super(user);
  }
}

const ExampleServiceInstance = new UsersService(ExampleSchemaModel);

export { ExampleServiceInstance as ExampleService };
