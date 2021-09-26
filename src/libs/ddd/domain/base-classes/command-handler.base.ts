import { UnitOfWorkPort } from '../ports/unit-of-work.port';
import { Result } from '../utils/result.util';
import { Command } from './command.base';

export abstract class CommandHandlerBase {
  constructor(protected readonly unitOfWork: UnitOfWorkPort) {}

  // Forces all command handlers to implement a handle method
  abstract handle(command: Command): Promise<Result<unknown>>;

  /**
   * Execute a command as a UnitOfWork to include
   * everything in a single atomic database transaction
   */
  execute(command: Command): Promise<Result<unknown>> {
    return this.unitOfWork.execute(command.correlationId, async () =>
      this.handle(command),
    );
  }
}
