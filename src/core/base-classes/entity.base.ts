import { DateVO } from '../value-objects/date.value-object';
import { ID } from '../value-objects/id.value-object';

export interface EntityProps {
  id?: ID;
  createdAt?: DateVO;
  updatedAt?: DateVO;
}

export abstract class Entity<Props extends EntityProps> {
  constructor(props: Props) {
    this._id = props.id ? props.id : new ID();
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  private readonly _id?: ID;

  private readonly _createdAt?: DateVO;

  private readonly _updatedAt?: DateVO;

  get id(): ID {
    return this._id as ID;
  }

  get createdAt(): DateVO {
    return this._createdAt as DateVO;
  }

  get updatedAt(): DateVO {
    return this._updatedAt as DateVO;
  }

  isEntity(entity: unknown): entity is Entity<Props> {
    return entity instanceof Entity;
  }

  equals(object?: Entity<Props>): boolean {
    if (object === null || object === undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!this.isEntity(object)) {
      return false;
    }

    return this.id ? this.id.equals(object.id) : false;
  }
}
