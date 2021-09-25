import { Result } from '../utils/result.util';

export abstract class Query {}

export abstract class QueryHandlerBase {
  // For consistency with a CommandHandlerBase and DomainEventHandler
  abstract handle(query: Query): Promise<Result<unknown>>;

  execute(query: Query): Promise<Result<unknown>> {
    return this.handle(query);
  }
}
