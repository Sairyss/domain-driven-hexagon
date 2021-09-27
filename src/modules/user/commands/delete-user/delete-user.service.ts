import { UserRepositoryPort } from '@modules/user/database/user.repository.port';
import { CommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../database/user.repository';
import { DeleteUserCommand } from './delete-user.command';

@CommandHandler(DeleteUserCommand)
export class DeleteUserService {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const found = await this.userRepo.findOneByIdOrThrow(command.userId);
    await this.userRepo.delete(found);
  }
}
