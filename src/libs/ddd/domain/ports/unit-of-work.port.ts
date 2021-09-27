import { Result } from '../utils/result.util';

export interface UnitOfWorkPort {
  execute<T>(
    correlationId: string,
    callback: () => Promise<T>,
    options?: unknown,
  ): Promise<T>;
}
