import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';
import { UnitOfWorkPort } from '../ports/unit-of-work.port';
import { ID } from '../value-objects/id.value-object';
import { Command } from './command.base';

export abstract class CommandHandler<UnitOfWork extends UnitOfWorkPort> {
  constructor(protected readonly unitOfWork: UnitOfWork) {}

  protected abstract execute(command: Command): Promise<ID>;

  async executeUnitOfWork(
    command: Command,
    options?: { isolationLevel: IsolationLevel },
  ): Promise<ID> {
    this.unitOfWork.init(command.correlationId);
    return this.unitOfWork.execute(
      command.correlationId,
      async () => this.execute(command),
      options,
    );
  }
}
