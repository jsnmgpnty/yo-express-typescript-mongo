import * as _ from 'lodash';
import { Document, Model, Types } from 'mongoose';
import { RepositoryBase } from '../database';
import { Logger } from '../logging';
import { EntityMetadata, ErrorInfo, BaseEntity } from '../models';

export class BaseService<T extends BaseEntity> {
  public repository: RepositoryBase<T>;

  constructor(model: Model<Document>) {
    this.repository = new RepositoryBase(model);
  }

  public async create(item: T): Promise<EntityMetadata<T>> {
    try {
      const result = await this.repository.create(item);
      if (!result) {
        return this.convertToEntityMetadata<T>(null, null);
      }

      return this.convertToEntityMetadata(null, result);
    } catch (error) {
      return this.convertToEntityMetadata<T>(error);
    }
  }

  public createWithCallback(
    item: T,
    callback: (error: any, result: T) => void
  ) {
    this.repository.createWithCallback(item, callback);
  }

  public async getAll(): Promise<EntityMetadata<T[]>> {
    try {
      const result = await this.repository.getAll();
      if (!result) {
        return this.convertToEntityMetadata<T[]>(null, null);
      }

      return this.convertToEntityMetadata<T[]>(null, result);
    } catch (error) {
      return this.convertToEntityMetadata<T[]>(error);
    }
  }

  public getAllWithCallback(callback: (error: any, result: T[]) => void) {
    this.repository.getAllWithCallback(callback);
  }

  public async update(id: Types.ObjectId, item: T): Promise<EntityMetadata<T>> {
    try {
      const result = await this.repository.update(id, item);
      if (!result) {
        return this.convertToEntityMetadata<T>(null, null);
      }

      return this.convertToEntityMetadata<T>(null, result);
    } catch (error) {
      return this.convertToEntityMetadata<T>(error);
    }
  }

  public updateWithCallback(
    id: Types.ObjectId,
    item: T,
    callback: (error: any, result: any) => void
  ) {
    this.repository.updateWithCallback(id, item, callback);
  }

  public async delete(id: string): Promise<EntityMetadata<boolean>> {
    try {
      const result = await this.repository.delete(id);
      if (!result) {
        return this.convertToEntityMetadata<boolean>(null, null);
      }

      if (!_.isNil(result.ok) && result.ok > 0) {
        return this.convertToEntityMetadata<boolean>(null, true);
      } else {
        return this.convertToEntityMetadata<boolean>(
          'RemoveResourceFailed',
          false
        );
      }
    } catch (error) {
      return this.convertToEntityMetadata<boolean>(error);
    }
  }

  public deleteWithCallback(
    id: string,
    callback: (error: any, result: any) => void
  ) {
    this.repository.deleteWithCallback(id, callback);
  }

  public async findById(id: string): Promise<EntityMetadata<T>> {
    try {
      const result = await this.repository.findById(id);
      if (!result) {
        return this.convertToEntityMetadata<T>(null, null);
      }

      return this.convertToEntityMetadata<T>(null, result);
    } catch (error) {
      return this.convertToEntityMetadata<T>(error);
    }
  }

  public findByIdWithCallback(
    id: string,
    callback: (error: any, result: T) => void
  ) {
    this.repository.findByIdWithCallback(id, callback);
  }

  public async findOne(cond?: object): Promise<EntityMetadata<T>> {
    try {
      const result = await this.repository.findOne(cond);
      if (!result) {
        return this.convertToEntityMetadata<T>(null, null);
      }

      return this.convertToEntityMetadata<T>(null, result);
    } catch (error) {
      return this.convertToEntityMetadata<T>(error);
    }
  }

  public findOneWithCallback(
    cond?: object,
    callback?: (error: any, res: T) => void
  ) {
    this.repository.findOneWithCallback(cond, callback);
  }

  public async find(
    cond?: object,
    options?: object
  ): Promise<EntityMetadata<T[]>> {
    try {
      const result = await this.repository.find(cond, options);
      if (!result) {
        return this.convertToEntityMetadata<T[]>(null, null);
      }

      return this.convertToEntityMetadata<T[]>(null, result);
    } catch (error) {
      return this.convertToEntityMetadata<T[]>(error);
    }
  }

  public findWithCallback(
    cond?: object,
    options?: object,
    callback?: (error: any, res: T[]) => void
  ) {
    this.repository.findWithCallback(cond, options, callback);
  }

  protected convertToEntityMetadata<TResult>(
    err?: any,
    result?: TResult | undefined | null
  ): EntityMetadata<TResult> {
    if (err) {
      const error: ErrorInfo = new ErrorInfo(null, err.toString());
      return new EntityMetadata<TResult>(undefined, error);
    }

    if (!result) {
      const error: ErrorInfo = new ErrorInfo(null, 'EmptyResult');
      return new EntityMetadata<TResult>(undefined, error);
    }

    return new EntityMetadata<TResult>(result);
  }

  protected getErrorEntityMetadata<TResult>(
    err: string,
    errorType: string
  ): EntityMetadata<TResult> {
    Logger.instance.error(err);
    const error: ErrorInfo = new ErrorInfo(errorType, err);
    return new EntityMetadata<TResult>(undefined, error);
  }

  protected getSuccessEntityMetadata<TResult>(
    data: TResult
  ): EntityMetadata<TResult> {
    return new EntityMetadata<TResult>(data);
  }
}
