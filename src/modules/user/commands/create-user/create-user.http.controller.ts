import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { IdResponse } from '@libs/ddd/interface-adapters/dtos/id.response.dto';
import { routesV1 } from '@config/app.routes';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { ConflictException } from '@src/libs/exceptions';
import { match, Result } from 'oxide.ts/dist';
import { CreateUserCommand } from './create-user.command';
import { UserAlreadyExistsError } from '../../errors/user.errors';
import { CreateUserRequest } from './create-user.request.dto';

@Controller(routesV1.version)
export class CreateUserHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post(routesV1.user.root)
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: IdResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: UserAlreadyExistsError.message,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
  })
  async create(@Body() body: CreateUserRequest): Promise<IdResponse> {
    const command = new CreateUserCommand(body);

    const result: Result<
      ID,
      UserAlreadyExistsError
    > = await this.commandBus.execute(command);

    // Deciding what to do with a Result (similar to Rust matching)
    // if Ok we return a response with an id
    // if Error decide what to do with it depending on its type
    return match(result, {
      Ok: id => new IdResponse(id.value),
      Err: error => {
        if (error instanceof UserAlreadyExistsError)
          throw new ConflictException(error.message);
        throw error;
      },
    });
  }
}
