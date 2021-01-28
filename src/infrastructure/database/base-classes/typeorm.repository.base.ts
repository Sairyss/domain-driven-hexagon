import { FindConditions, ObjectLiteral, Repository } from 'typeorm';
import { ID } from 'src/core/value-objects/id.value-object';
import { DomainEvents } from 'src/core/domain-events';
import { Logger } from 'src/core/ports/logger.port';
import {
  QueryParams,
  FindManyPaginatedParams,
  RepositoryPort,
  DataWithPaginationMeta,
} from '../../../core/ports/repository.ports';
import { NotFoundException } from '../../../core/exceptions';
import { OrmMapper } from './orm-mapper.base';
import { BaseEntityProps } from '../../../core/base-classes/entity.base';

export type WhereCondition<OrmEntity> =
  | FindConditions<OrmEntity>[]
  | FindConditions<OrmEntity>
  | ObjectLiteral
  | string;

export abstract class TypeormRepositoryBase<
  Entity extends BaseEntityProps,
  EntityProps,
  OrmEntity
> implements RepositoryPort<Entity, EntityProps> {
  protected constructor(
    protected readonly repository: Repository<OrmEntity>,
    protected readonly mapper: OrmMapper<Entity, OrmEntity>,
    protected readonly logger: Logger,
  ) {}

  protected abstract relations: string[] = [];

  protected tableName = this.repository.metadata.tableName;

  protected abstract prepareQuery(
    params: QueryParams<EntityProps>,
  ): WhereCondition<OrmEntity>;

  async save(entity: Entity): Promise<Entity> {
    const ormEntity = this.mapper.toOrmEntity(entity);
    const result = await this.repository.save(ormEntity);
    this.logger.debug(
      `[Entity persisted]: ${this.tableName} ${entity.id.value}`,
    );
    await DomainEvents.publishEvents(entity.id, this.logger);
    return this.mapper.toDomainEntity(result);
  }

  async saveMultiple(entities: Entity[]): Promise<Entity[]> {
    const ormEntities = entities.map(entity => this.mapper.toOrmEntity(entity));
    const result = await this.repository.save(ormEntities);
    this.logger.debug(
      `[Multiple entities persisted]: ${entities.length} ${this.tableName}`,
    );
    await Promise.all(
      entities.map(entity =>
        DomainEvents.publishEvents(entity.id, this.logger),
      ),
    );
    return result.map(entity => this.mapper.toDomainEntity(entity));
  }

  async findOne(
    params: QueryParams<EntityProps> = {},
  ): Promise<Entity | undefined> {
    const where = this.prepareQuery(params);
    const found = await this.repository.findOne({
      where,
      relations: this.relations,
    });
    return found ? this.mapper.toDomainEntity(found) : undefined;
  }

  async findOneOrThrow(params: QueryParams<EntityProps> = {}): Promise<Entity> {
    const found = await this.findOne(params);
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  async findOneByIdOrThrow(id: ID | string): Promise<Entity> {
    const found = await this.repository.findOne({
      where: { id: id instanceof ID ? id.value : id },
    });
    if (!found) {
      throw new NotFoundException();
    }
    return this.mapper.toDomainEntity(found);
  }

  async findMany(params: QueryParams<EntityProps> = {}): Promise<Entity[]> {
    const result = await this.repository.find({
      where: this.prepareQuery(params),
      relations: this.relations,
    });

    return result.map(item => this.mapper.toDomainEntity(item));
  }

  async findManyPaginated({
    params = {},
    pagination,
    orderBy,
  }: FindManyPaginatedParams<EntityProps>): Promise<
    DataWithPaginationMeta<Entity[]>
  > {
    const [data, count] = await this.repository.findAndCount({
      skip: pagination?.skip,
      take: pagination?.limit,
      where: this.prepareQuery(params),
      order: orderBy,
      relations: this.relations,
    });

    const result: DataWithPaginationMeta<Entity[]> = {
      data: data.map(item => this.mapper.toDomainEntity(item)),
      count,
      limit: pagination?.limit,
      page: pagination?.page,
    };

    return result;
  }

  async delete(entity: Entity): Promise<Entity> {
    await this.repository.remove(this.mapper.toOrmEntity(entity));
    this.logger.debug(`[Entity deleted]: ${this.tableName} ${entity.id.value}`);
    await DomainEvents.publishEvents(entity.id, this.logger);
    return entity;
  }
}
