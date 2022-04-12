import { Result } from 'oxide.ts/dist';

export abstract class Query {}

export abstract class QueryHandlerBase {
  // For consistency with a CommandHandlerBase and DomainEventHandler
  abstract handle(query: Query): Promise<Result<unknown, Error>>;

  execute(query: Query): Promise<Result<unknown, Error>> {
    return this.handle(query);
  }
}
