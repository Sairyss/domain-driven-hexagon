import { UserRepositoryPort } from '@modules/user/database/user.repository.interface';
import { DeleteUserCommand } from './delete-user.command';

export class DeleteUserService {
  constructor(private readonly userRepo: UserRepositoryPort) {}

  async delete(command: DeleteUserCommand): Promise<void> {
    const found = await this.userRepo.findOneByIdOrThrow(command.userId);
    await this.userRepo.delete(found);
  }
}
