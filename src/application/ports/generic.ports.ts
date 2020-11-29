import { ID } from 'src/domain/value-objects/id.value-object';

/*  Most of repos will probably need generic 
    save/find/delete operations, so it's easier
    to have some shared interfaces.
    More specific interfaces should be defined
    in a respective module/use case.
*/

export interface Save<Entity> {
  save(entity: Entity): Promise<Entity>;
}

export interface FindOne<Entity> {
  findOneOrThrow(id: ID | string): Promise<Entity>;
}

export interface DeleteOne<Entity> {
  delete(id: ID | string): Promise<Entity>;
}

export interface RepositoryPort<Entity>
  extends Save<Entity>,
    FindOne<Entity>,
    DeleteOne<Entity> {}
