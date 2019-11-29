import { Model, model } from 'mongoose';
import { Example, extendSchema } from '../models';
import { BaseEntitySchema, BaseEntitySchemaOptions } from './BaseEntitySchema';

const ExampleSchema = extendSchema(
  BaseEntitySchema,
  {
    name: String,
  },
  BaseEntitySchemaOptions,
);

const ExampleSchemaModel: Model<Example> = model<Example>('Example', ExampleSchema);

export { ExampleSchemaModel };
