import { PaginatedQueryParams, RepositoryPort } from '@libs/ddd';
import { UserEntity } from '../domain/user.entity';

export interface FindUsersParams extends PaginatedQueryParams {
  readonly country?: string;
  readonly postalCode?: string;
  readonly street?: string;
}

export interface UserRepositoryPort extends RepositoryPort<UserEntity> {
  findOneByEmail(email: string): Promise<UserEntity | null>;
}
