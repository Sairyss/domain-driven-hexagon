import { nanoid } from 'nanoid';
import { ArgumentNotProvidedException } from '../../../exceptions';
import { Guard } from '../guard';
import { UUID } from '../value-objects/uuid.value-object';

export type CommandProps<T> = Omit<T, 'correlationId' | 'id'> &
  Partial<Command>;

export class Command {
  /**
   * Command id, in case if we want to save it
   * for auditing purposes and create a correlation/causation chain
   */
  public readonly id: string;

  /** ID for correlation purposes (for UnitOfWork, for commands that
   *  arrive from other microservices,logs correlation etc). */
  public readonly correlationId: string;

  /**
   * Causation id to reconstruct execution ordering if needed
   */
  public readonly causationId?: string;

  constructor(props: CommandProps<unknown>) {
    if (Guard.isEmpty(props)) {
      throw new ArgumentNotProvidedException(
        'Command props should not be empty',
      );
    }
    this.correlationId = props.correlationId || nanoid(8);
    this.id = props.id || UUID.generate().unpack();
  }
}
