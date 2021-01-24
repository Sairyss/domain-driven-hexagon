import { ArgumentNotProvidedException } from '../exceptions';
import { Guard } from '../guard';

export type Primitives = string | number | boolean;
export interface DomainPrimitive<T = Primitives> {
  value: T;
}

type ValueObjectProps<T> = T extends Primitives ? DomainPrimitive<T> : T;

export abstract class ValueObject<T> {
  protected readonly props: ValueObjectProps<T>;

  constructor(props: ValueObjectProps<T>) {
    this.checkIfEmpty(props);
    this.validate(props);
    this.props = props;
  }

  protected abstract validate(props: ValueObjectProps<T>): void;

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    return JSON.stringify(this) === JSON.stringify(vo);
  }

  private checkIfEmpty(props: ValueObjectProps<T>): void {
    if (Guard.isEmpty(props)) {
      throw new ArgumentNotProvidedException('Property cannot be empty');
    }
  }
}
