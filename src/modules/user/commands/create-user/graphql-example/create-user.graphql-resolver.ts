import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../create-user.command';
import { CreateUserGqlRequestDto } from './dtos/create-user.gql-request.dto';
import { IdGqlResponse } from './dtos/id.gql-response.dto';
import { AggregateID } from '@src/libs/ddd';
import { UserAlreadyExistsError } from '@src/modules/user/domain/user.errors';
import { Result } from 'oxide.ts';

// If you are Using GraphQL you'll need a Resolver instead of a Controller
@Resolver()
export class CreateUserGraphqlResolver {
  constructor(private readonly commandBus: CommandBus) {}

  @Mutation(() => IdGqlResponse)
  async create(
    @Args('input') input: CreateUserGqlRequestDto,
  ): Promise<IdGqlResponse> {
    const command = new CreateUserCommand(input);

    const id: Result<AggregateID, UserAlreadyExistsError> =
      await this.commandBus.execute(command);

    return new IdGqlResponse(id.unwrap());
  }
}
