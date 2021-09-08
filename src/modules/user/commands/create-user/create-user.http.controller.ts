import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { IdResponse } from 'src/interface-adapters/dtos/id.response.dto';
import { routes } from '@config/app.routes';
import { createUserSymbol } from '@modules/user/user.providers';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserCommand } from './create-user.command';
import { CreateUserService } from './create-user.service';
import { CreateUserRequest } from './create-user.request.dto';

@Controller()
export class CreateUserHttpController {
  constructor(
    @Inject(createUserSymbol)
    private readonly createUser: CreateUserService,
  ) {}

  @Post(routes.user.root)
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
  async create(@Body() body: CreateUserRequest): Promise<IdResponse> {
    const command = new CreateUserCommand({
      email: body.email,
      address: {
        country: body.country,
        postalCode: body.postalCode,
        street: body.street,
      },
    });

    const id = await this.createUser.createUser(command);

    return new IdResponse(id.value);
  }
}
