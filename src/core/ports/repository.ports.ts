import { BaseEntityProps } from '../base-classes/entity.base';
import { DeepPartial } from '../types';
import { ID } from '../value-objects/id.value-object';

/*  Most of repositories will probably need generic 
    save/find/delete operations, so it's easier
    to have some shared interfaces.
    More specific interfaces should be defined
    in a respective module/use case.
*/

export type QueryParams<EntityProps> = DeepPartial<
  BaseEntityProps & EntityProps
>;

export interface Save<Entity> {
  save(entity: Entity): Promise<Entity>;
}

export interface SaveMultiple<Entity> {
  saveMultiple(entities: Entity[]): Promise<Entity[]>;
}

export interface FindOne<Entity, EntityProps> {
  findOneOrThrow(params: QueryParams<EntityProps>): Promise<Entity>;
}

export interface FindOneById<Entity> {
  findOneByIdOrThrow(id: ID | string): Promise<Entity>;
}

export interface FindMany<Entity, EntityProps> {
  findMany(params: QueryParams<EntityProps>): Promise<Entity[]>;
}

export interface OrderBy {
  [key: number]: -1 | 1;
}

export interface PaginationMeta {
  skip?: number;
  limit?: number;
  page?: number;
}

export interface FindManyPaginatedParams<EntityProps> {
  params?: QueryParams<EntityProps>;
  pagination?: PaginationMeta;
  orderBy?: OrderBy;
}

export interface DataWithPaginationMeta<T> {
  data: T;
  count: number;
  limit?: number;
  page?: number;
}

export interface FindManyPaginated<Entity, EntityProps> {
  findManyPaginated(
    options: FindManyPaginatedParams<EntityProps>,
  ): Promise<DataWithPaginationMeta<Entity[]>>;
}

export interface DeleteOne<Entity> {
  delete(entity: Entity): Promise<Entity>;
}

export interface RepositoryPort<Entity, EntityProps>
  extends Save<Entity>,
    FindOne<Entity, EntityProps>,
    FindOneById<Entity>,
    FindMany<Entity, EntityProps>,
    FindManyPaginated<Entity, EntityProps>,
    DeleteOne<Entity>,
    SaveMultiple<Entity> {}
