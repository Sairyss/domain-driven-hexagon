import { createUserSymbol } from '@modules/user/user.providers';
import { Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IdResponse } from 'src/interface-adapters/dtos/id.response.dto';
import { CreateUserCommand } from './create-user.command';
import { CreateUserRequest } from './create-user.request.dto';
import { CreateUserService } from './create-user.service';

export class CreateUserEventController {
  constructor(
    @Inject(createUserSymbol)
    private readonly createUser: CreateUserService,
  ) {}

  @MessagePattern('user.create') // <- Subscribe to microservice event
  async create(payload: CreateUserRequest): Promise<IdResponse> {
    const command = new CreateUserCommand({
      email: payload.email,
      address: {
        country: payload.country,
        postalCode: payload.postalCode,
        street: payload.street,
      },
    });

    const id = await this.createUser.createUser(command);

    return new IdResponse(id.value);
  }
}
