import { RequestContextService } from '@libs/application/context/AppRequestContext';
import { v4 } from 'uuid';
import { ArgumentNotProvidedException } from '../exceptions';
import { Guard } from '../guard';

export type CommandProps<T> = Omit<T, 'correlationId' | 'id'> &
  Partial<Command>;

export class Command {
  /**
   * Command id, in case if we want to save it
   * for auditing purposes and create a correlation/causation chain
   */
  public readonly id: string;

  /** ID for correlation purposes (for commands that
   *  arrive from other microservices,logs correlation, etc). */
  public readonly correlationId: string;

  /**
   * Causation id to reconstruct execution order if needed
   */
  public readonly causationId?: string;

  constructor(props: CommandProps<unknown>) {
    if (Guard.isEmpty(props)) {
      throw new ArgumentNotProvidedException(
        'Command props should not be empty',
      );
    }
    const ctx = RequestContextService.getContext();
    this.correlationId = props.correlationId || ctx.requestId;
    this.id = props.id || v4();
  }
}
