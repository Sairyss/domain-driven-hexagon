import { UserRepository } from '@modules/user/database/user.repository';
import { QueryHandlerBase } from '@src/libs/ddd/domain/base-classes/query-handler.base';
import { QueryHandler } from '@nestjs/cqrs';
import { Ok, Result } from 'oxide.ts/dist';
import { FindUsersQuery } from './find-users.query';
import { UserEntity } from '../../domain/entities/user.entity';

@QueryHandler(FindUsersQuery)
export class FindUsersQueryHandler extends QueryHandlerBase {
  constructor(private readonly userRepo: UserRepository) {
    super();
  }

  /* Since this is a simple query with no additional business
     logic involved, it bypasses application's core completely 
     and retrieves users directly from a repository.
   */
  async handle(query: FindUsersQuery): Promise<Result<UserEntity[], Error>> {
    const users = await this.userRepo.findUsers(query);
    return Ok(users);
  }
}
