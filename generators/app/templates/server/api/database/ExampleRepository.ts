import { Example } from '../models';
import { ExampleSchemaModel } from '../schema';
import { RepositoryBase } from './RepositoryBase';

class ExampleRepository extends RepositoryBase<Example> {
  constructor() {
    super(ExampleSchemaModel);
  }
}

export { ExampleRepository };
