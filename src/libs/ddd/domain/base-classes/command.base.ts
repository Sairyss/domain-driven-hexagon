import { nanoid } from 'nanoid';
import { ArgumentNotProvidedException } from '../../../exceptions';
import { Guard } from '../guard';

export type CommandProps<T> = Omit<T, 'correlationId'> & Partial<Command>;

export class Command {
  /** ID for correlation purposes (for UnitOfWork, for commands that
   *  arrive from other microservices,logs correlation etc). */
  public readonly correlationId: string;

  constructor(props: CommandProps<unknown>) {
    if (Guard.isEmpty(props)) {
      throw new ArgumentNotProvidedException(
        'Command props should not be empty',
      );
    }
    this.correlationId = props.correlationId || nanoid(8);
  }
}
