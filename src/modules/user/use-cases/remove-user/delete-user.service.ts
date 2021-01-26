import { UserRepositoryPort } from '@modules/user/database/user.repository.interface';

export class DeleteUserService {
  constructor(private readonly userRepo: UserRepositoryPort) {}

  async delete(id: string): Promise<void> {
    await this.userRepo.delete(id);
  }
}
