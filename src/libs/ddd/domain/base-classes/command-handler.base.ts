import { UnitOfWorkOrm } from '../../infrastructure/database/base-classes/unit-of-work-orm';
import { ID } from '../value-objects/id.value-object';
import { Command } from './command.base';

export abstract class CommandHandler<UnitOfWork extends UnitOfWorkOrm> {
  constructor(protected readonly unitOfWork: UnitOfWork) {}

  protected abstract execute(command: Command): Promise<ID>;

  async executeUnitOfWork(command: Command): Promise<ID> {
    UnitOfWorkOrm.init(command.correlationId);
    return UnitOfWorkOrm.execute(command.correlationId, async () =>
      this.execute(command),
    );
  }
}
