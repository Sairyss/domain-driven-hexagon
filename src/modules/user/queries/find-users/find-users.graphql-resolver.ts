import { UserResponse } from '@modules/user/dtos/user.response.dto';
import { Args, Query, Resolver } from '@nestjs/graphql';
import {UserRepositoryPort} from "@modules/user/database/user.repository.port";
import {Inject} from "@nestjs/common";
import { FindUsersQuery } from './find-users.query';
import { FindUsersRequest } from './find-users.request.dto';

@Resolver()
export class FindUsersGraphqlResolver {
  constructor(
      @Inject("userRepositoryPort")
      private readonly userRepo: UserRepositoryPort) {}

  @Query(() => [UserResponse])
  async findUsers(
    @Args('input') input: FindUsersRequest,
  ): Promise<UserResponse[]> {
    const query = new FindUsersQuery(input);
    const users = await this.userRepo.findUsers(query);

    return users.map(user => new UserResponse(user));
  }
}
