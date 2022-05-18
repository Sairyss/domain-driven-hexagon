import { QueryHandlerBase } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { QueryHandler } from '@nestjs/cqrs';
import { Ok, Result } from 'oxide.ts/dist';
import { Inject } from '@nestjs/common';
import { FindUsersQuery } from './find-users.query';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepositoryPort } from '../../database/user.repository.port';
import { UserRepository } from '../../database/user.repository';

@QueryHandler(FindUsersQuery)
export class FindUsersQueryHandler extends QueryHandlerBase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepo: UserRepositoryPort,
  ) {
    super();
  }

  async handle(query: FindUsersQuery): Promise<Result<UserEntity[], Error>> {
    const users = await this.userRepo.findUsers(query);
    return Ok(users);
  }
}
