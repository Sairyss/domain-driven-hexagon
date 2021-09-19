import { nanoid } from 'nanoid';
import { ArgumentNotProvidedException } from '../../../exceptions';
import { Guard } from '../guard';

export type CommandProps<T> = Omit<T, 'correlationId'> & Partial<Command>;

export class Command {
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
