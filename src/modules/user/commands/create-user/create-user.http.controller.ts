import {
  Body,
  ConflictException,
  Controller,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { IdResponse } from '@libs/ddd/interface-adapters/dtos/id.response.dto';
import { routesV1 } from '@config/app.routes';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { Result } from '@src/libs/ddd/domain/utils/result.util';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';
import { CreateUserCommand } from './create-user.command';
import { CreateUserHttpRequest } from './create-user.request.dto';
import { UserAlreadyExistsError } from '../../errors/user.errors';

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
  async create(@Body() body: CreateUserHttpRequest): Promise<IdResponse> {
    const command = new CreateUserCommand(body);

    const result: Result<
      ID,
      UserAlreadyExistsError
    > = await this.commandBus.execute(command);

    return result.unwrap(
      id => new IdResponse(id.value), // if ok return an id
      error => {
        // if error decide what to do with it
        if (error instanceof UserAlreadyExistsError)
          throw new ConflictException(error.message);
        throw error;
      },
    );
  }
}
