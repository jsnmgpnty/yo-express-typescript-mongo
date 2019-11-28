import { Route, Get } from 'tsoa';
import { ExampleService } from '../services';
import {
  EntityMetadata,
  ExampleModel,
} from '../models';
import { BaseController } from './BaseController';

@Route('users')
export class ExampleController extends BaseController {
  @Get()
  public async all(): Promise<EntityMetadata<ExampleModel[]>> {
    const results = await ExampleService.getAll();
    return this.handleResponse(results, 'UnhandledError');
  }
}
