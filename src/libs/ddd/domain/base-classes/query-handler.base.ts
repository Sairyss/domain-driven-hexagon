import { Result } from '../utils/result.util';

export abstract class Query {}

export abstract class QueryHandlerBase {
  abstract execute(query: Query): Promise<Result<unknown>>;
}
