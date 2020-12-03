import { RepositoryPort } from 'src/core/ports/generic.ports';
import { ID } from 'src/core/value-objects/id.value-object';
import { NotFoundException } from '@exceptions';
import { Repository } from 'typeorm';
import { OrmEntityBase } from './orm-entity.base';

type OrmEntity<Entity> = new (entity: Entity) => OrmEntityBase<Entity>;

export abstract class RepositoryBase<Entity> implements RepositoryPort<Entity> {
  protected constructor(
    protected readonly repository: Repository<OrmEntityBase<Entity>>,
    protected readonly OrmEntity: OrmEntity<Entity>,
  ) {}

  async save(entity: Entity): Promise<Entity> {
    const ormEntity = new this.OrmEntity(entity);
    const result = await this.repository.save(
      this.repository.create(ormEntity),
    );
    return result.toDomain();
  }

  async findOne(id: ID | string): Promise<OrmEntityBase<Entity> | undefined> {
    const found = await this.repository.findOne({
      id: id instanceof ID ? id.value : id,
    });
    return found;
  }

  async findOneOrThrow(id: ID | string): Promise<Entity> {
    const found = await this.findOne(id);
    if (!found) {
      throw new NotFoundException();
    }
    return found.toDomain();
  }

  async delete(id: ID | string): Promise<Entity> {
    const found = await this.findOneOrThrow(id);
    await this.repository.remove(new this.OrmEntity(found));
    return found;
  }
}
