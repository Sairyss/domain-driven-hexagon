import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IdResponse } from '@libs/ddd/interface-adapters/dtos/id.response.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { CreateUserMessageRequest } from './create-user.request.dto';

@Controller()
export class CreateUserMessageController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern('user.create') // <- Subscribe to a microservice message
  async create(message: CreateUserMessageRequest): Promise<IdResponse> {
    const command = new CreateUserCommand(message);

    const id = await this.commandBus.execute(command);

    return new IdResponse(id.unwrap().value);
  }
}
