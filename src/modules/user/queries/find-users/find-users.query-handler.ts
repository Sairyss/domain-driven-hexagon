import { QueryHandlerBase } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { QueryHandler } from '@nestjs/cqrs';
import { Result } from '@libs/ddd/domain/utils/result.util';
import {Inject} from "@nestjs/common";
import {UserRepositoryPort} from "@modules/user/database/user.repository.port";
import { FindUsersQuery } from './find-users.query';
import { UserEntity } from '../../domain/entities/user.entity';

@QueryHandler(FindUsersQuery)
export class FindUsersQueryHandler extends QueryHandlerBase {
  constructor(@Inject("userRepositoryPort")
              private readonly userRepo: UserRepositoryPort) {
    super();
  }

  /* Since this is a simple query with no additional business
     logic involved, it bypasses application's core completely 
     and retrieves users directly from a repository.
   */
  async handle(query: FindUsersQuery): Promise<Result<UserEntity[]>> {
    const users = await this.userRepo.findUsers(query);
    return Result.ok(users);
  }
}
