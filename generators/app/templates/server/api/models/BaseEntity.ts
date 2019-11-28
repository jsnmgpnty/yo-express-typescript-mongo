import * as mongoose from 'mongoose';

export interface BaseEntity extends mongoose.Document {
  createdDate?: Date;
  createdBy?: string;
  modifiedDate?: Date;
  modifiedBy?: string;
}

export class BaseEntityModel {
  id?: string;
  createdDate?: Date;
  createdBy?: string;
  modifiedDate?: Date;
  modifiedBy?: string;
}
