import * as mongoose from 'mongoose';
import { BaseEntity } from '../models';

export class RepositoryBase<T extends BaseEntity> {
  private model: mongoose.Model<mongoose.Document>;

  constructor(schemaModel: mongoose.Model<mongoose.Document>) {
    this.model = schemaModel;
  }

  public async create(item: T): Promise<T> {
    item.createdDate = new Date();
    item.modifiedDate = new Date();
    return this.model.create(item) as Promise<T>;
  }

  public createWithCallback(
    item: T,
    callback: (error: any, result: T) => void
  ) {
    item.createdDate = new Date();
    item.modifiedDate = new Date();
    this.model.create(item, callback);
  }

  public async getAll(): Promise<T[]> {
    const result = this.model.find({});
    return result.exec() as Promise<T[]>;
  }

  public getAllWithCallback(callback: (error: any, result: T[]) => void) {
    this.model.find({}, callback);
  }

  public async update(id: mongoose.Types.ObjectId, item: T): Promise<T> {
    item.modifiedDate = new Date();
    const result = this.model.update({ _id: id }, item);
    return result.exec() as Promise<T>;
  }

  public updateWithCallback(
    id: mongoose.Types.ObjectId,
    item: T,
    callback: (error: any, result: any) => void
  ) {
    item.modifiedDate = new Date();
    this.model.update({ _id: id }, item, callback);
  }

  public async delete(id: string): Promise<{ ok?: number; n?: number }> {
    const result = this.model.remove({ _id: this.toObjectId(id) });
    return result.exec();
  }

  public deleteWithCallback(
    id: string,
    callback: (error: any, result: any) => void
  ) {
    this.model.remove({ _id: this.toObjectId(id) }, err => callback(err, null));
  }

  public async findById(id: string): Promise<T> {
    const result = this.model.findById(id);
    return result.exec() as Promise<T>;
  }

  public findByIdWithCallback(
    id: string,
    callback: (error: any, result: T) => void
  ) {
    this.model.findById(id, callback);
  }

  public async findOne(
    cond?: object,
    callback?: (error: any, res: T) => void
  ): Promise<T> {
    const result = this.model.findOne(cond);
    return result.exec() as Promise<T>;
  }

  public findOneWithCallback(
    cond?: object,
    callback?: (error: any, res: T) => void
  ) {
    return this.model.findOne(cond, callback);
  }

  public async find(cond?: object, options?: object): Promise<T[]> {
    const result = this.model.find(cond, options);
    return result.exec() as Promise<T[]>;
  }

  public findWithCallback(
    cond?: object,
    options?: object,
    callback?: (error: any, res: T[]) => void
  ) {
    return this.model.find(cond, options, callback);
  }

  private toObjectId(id: string): mongoose.Types.ObjectId {
    return mongoose.Types.ObjectId.createFromHexString(id);
  }
}
