import { BaseEntity, BaseEntityModel } from './BaseEntity';

export interface Example extends BaseEntity {
  name: string;
}

export class ExampleModel extends BaseEntityModel {
  name: string;
}
