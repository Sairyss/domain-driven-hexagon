import { ValidationException } from '../exceptions';
import { Guard } from '../guard';

export abstract class ValueObject {
  constructor(props: unknown) {
    /* It makes no sense for a Value Object to be empty
       so first thing we do is checking if props are not empty.
    */
    this.checkIfEmpty(props);
  }

  public equals(vo?: ValueObject): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    return JSON.stringify(this) === JSON.stringify(vo);
  }

  private checkIfEmpty(props: unknown): void {
    if (Guard.isEmpty(props)) {
      throw new ValidationException(
        'Value Object cannot be created with empty props',
      );
    }
  }
}
