import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { IdResponse } from '@libs/ddd/interface-adapters/dtos/id.response.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { CreateUserRequest } from './create-user.request.dto';

// If you are Using GraphQL you'll need a Resolver instead of a Controller

@Resolver()
export class CreateUserGraphqlResolver {
  constructor(private readonly commandBus: CommandBus) {}

  @Mutation(() => IdResponse)
  async create(@Args('input') input: CreateUserRequest): Promise<IdResponse> {
    const command = new CreateUserCommand(input);

    const id = await this.commandBus.execute(command);

    return new IdResponse(id.unwrap().value);
  }
}
