import { EntityProps } from 'src/core/base-classes/entity.base';
import { DateVO } from 'src/core/value-objects/date.value-object';
import { ID } from 'src/core/value-objects/id.value-object';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class OrmEntityBase<Entity extends EntityProps> {
  constructor(entity: Entity) {
    // typeorm is not aware of your constructor arguments so "if" must be used.
    if (entity) {
      this.id = entity.id?.value;
      this.createdAt = entity.createdAt ? entity.createdAt.value : undefined;
      this.updatedAt = entity.updatedAt ? entity.updatedAt.value : undefined;
      this.toPersistence(entity);
    }
  }

  abstract toPersistence(entity: Entity): OrmEntityBase<Entity>;

  abstract toDomain(): Entity;

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt?: Date;

  protected toDomainBaseProps(): EntityProps {
    return {
      id: new ID(this.id as string),
      createdAt: new DateVO(this.createdAt as Date),
      updatedAt: new DateVO(this.updatedAt as Date),
    };
  }
}
