import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { UserRepositoryPort } from '../../database/user.repository.port';
import { USER_REPOSITORY } from '../../user.di-tokens';
import { UserEntity } from '@modules/user/domain/user.entity';
import { PaginatedParams, PaginatedQueryBase } from '@libs/ddd/query.base';
import { Paginated } from '@src/libs/ddd';

export class FindUsersQuery extends PaginatedQueryBase {
  readonly country?: string;

  readonly postalCode?: string;

  readonly street?: string;

  constructor(props: PaginatedParams<FindUsersQuery>) {
    super(props);
    this.country = props.country;
    this.postalCode = props.postalCode;
    this.street = props.street;
  }
}

@QueryHandler(FindUsersQuery)
export class FindUsersQueryHandler implements IQueryHandler {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(
    query: FindUsersQuery,
  ): Promise<Result<Paginated<UserEntity>, Error>> {
    const users = await this.userRepo.findUsers(query);
    return Ok(users);
  }
}
