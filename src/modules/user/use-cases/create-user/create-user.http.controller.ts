import { Body, Controller, Inject, Post } from '@nestjs/common';
import { IdResponseDTO } from 'src/interface-adapters/dtos/id.response.dto';
import { routes } from '@config/app.routes';

import { createUserSymbol } from '@modules/user/user.providers';
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
  async create(@Body() body: CreateUserRequest): Promise<IdResponseDTO> {
    const command = new CreateUserCommand({
      email: body.email,
      address: {
        country: body.country,
        postalCode: body.postalCode,
        street: body.street,
      },
    });

    const id = await this.createUser.createUser(command);

    return new IdResponseDTO(id.value);
  }
}
