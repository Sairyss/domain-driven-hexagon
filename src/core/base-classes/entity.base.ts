import {
  ArgumentNotProvidedException,
  ArgumentInvalidException,
} from '../exceptions';
import { Guard } from '../guard';
import { DateVO } from '../value-objects/date.value-object';
import { ID } from '../value-objects/id.value-object';

export interface BaseEntityProps {
  id: ID;
  createdAt: DateVO;
  updatedAt: DateVO;
}

export abstract class Entity<EntityProps> {
  constructor(props: EntityProps) {
    this.validateProps(props);
    this._id = ID.generate();
    this._createdAt = DateVO.now();
    this._updatedAt = DateVO.now();
    this.props = props;
  }

  protected readonly props: EntityProps;

  /**
   * Returns current **copy** of entity's props.
   * Modifying entity's state won't change previously created
   * copy returned by this method since it doesn't return a reference.
   * If a reference to a specific property is needed create a getter in parent class.
   *
   * @return {*}  {Props & EntityProps}
   * @memberof Entity
   */
  public getPropsCopy(): EntityProps & BaseEntityProps {
    const propsCopy = {
      id: this._id,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      ...this.props,
    };
    return Object.freeze(propsCopy);
  }

  private readonly _id: ID;

  private readonly _createdAt: DateVO;

  private _updatedAt: DateVO;

  get id(): ID {
    return this._id;
  }

  get createdAt(): DateVO {
    return this._createdAt;
  }

  get updatedAt(): DateVO {
    return this._updatedAt;
  }

  equals(object?: Entity<EntityProps>): boolean {
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

  private isEntity(entity: unknown): entity is Entity<EntityProps> {
    return entity instanceof Entity;
  }

  private validateProps(props: EntityProps) {
    const maxProps = 50;

    if (Guard.isEmpty(props)) {
      throw new ArgumentNotProvidedException(
        'Entity props should not be empty',
      );
    }
    if (typeof props !== 'object') {
      throw new ArgumentInvalidException('Entity props should be an object');
    }
    if (Object.keys(props).length > maxProps) {
      throw new ArgumentInvalidException(
        `Entity props should not have more then ${maxProps} properties`,
      );
    }
  }
}
