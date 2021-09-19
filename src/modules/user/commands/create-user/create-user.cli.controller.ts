import {
  createUserCliLoggerSymbol,
  createUserSymbol,
} from '@modules/user/user.providers';
import { Inject } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';
import { Logger } from '@libs/ddd/domain/ports/logger.port';
import { CreateUserCommand } from './create-user.command';
import { CreateUserService } from './create-user.service';

// Allows creating a user using CLI
@Console({
  command: 'new',
  description: 'A command to create a user',
})
export class CreateUserCliController {
  constructor(
    @Inject(createUserSymbol)
    private readonly service: CreateUserService,
    @Inject(createUserCliLoggerSymbol)
    private readonly logger: Logger,
  ) {}

  @Command({
    command: 'user <email> <country> <postalCode> <street>',
    description: 'Create a user',
  })
  async createUser(
    email: string,
    country: string,
    postalCode: string,
    street: string,
  ): Promise<void> {
    const command = new CreateUserCommand({
      email,
      country,
      postalCode,
      street,
    });

    const id = await this.service.executeUnitOfWork(command);

    this.logger.log('User created:', id.value);
  }
}
