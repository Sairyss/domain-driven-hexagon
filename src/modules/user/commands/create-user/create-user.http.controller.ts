import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { IdResponse } from '@libs/ddd/interface-adapters/dtos/id.response.dto';
import { routesV1 } from '@config/app.routes';
import { createUserSymbol } from '@modules/user/user.providers';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserCommand } from './create-user.command';
import { CreateUserService } from './create-user.service';
import { CreateUserHttpRequest } from './create-user.request.dto';

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

    const id = await this.service.executeUnitOfWork(command);

    return new IdResponse(id.value);
  }
}
