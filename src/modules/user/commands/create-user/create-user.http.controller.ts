import {
  Body,
  ConflictException,
  Controller,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { IdResponse } from '@libs/ddd/interface-adapters/dtos/id.response.dto';
import { routesV1 } from '@config/app.routes';
import { createUserSymbol } from '@modules/user/user.providers';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserCommand } from './create-user.command';
import { CreateUserService } from './create-user.service';
import { CreateUserHttpRequest } from './create-user.request.dto';
import { UserAlreadyExistsError } from '../../errors/user.errors';

@Controller(routesV1.version)
export class CreateUserHttpController {
  constructor(
    @Inject(createUserSymbol)
    private readonly service: CreateUserService,
  ) {}

  @Post(routesV1.user.root)
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: IdResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User already exists',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
  })
  async create(@Body() body: CreateUserHttpRequest): Promise<IdResponse> {
    const command = new CreateUserCommand(body);

    /* Unlike with throwing errors, by returning them
       you can explicitly see what errors this method returns.
       Just hover your cursor over a 'result' variable. */
    const result = await this.service.execute(command);

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
