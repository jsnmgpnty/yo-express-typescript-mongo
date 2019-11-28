import { Model, model } from 'mongoose';
import { Example, extendSchema } from '../models';
import { BaseEntitySchema } from './BaseEntitySchema';

const ExampleSchema = extendSchema(
  BaseEntitySchema,
  {
    name: String,
  },
  null
);

const ExampleSchemaModel: Model<Example> = model<Example>('Example', ExampleSchema);

export { ExampleSchemaModel };
