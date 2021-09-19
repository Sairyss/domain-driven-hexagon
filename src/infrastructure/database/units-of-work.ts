import { UserOrmEntity } from '@modules/user/database/user.orm-entity';
import { UserRepository } from '@modules/user/database/user.repository';
import { WalletOrmEntity } from '@modules/wallet/database/wallet.orm-entity';
import { UnitOfWork } from 'src/infrastructure/database/base-classes/unit-of-work.base';
import { Repository } from 'typeorm';

export class CreateUserUoW extends UnitOfWork {
  static getUserRepository(): UserRepository {
    return new UserRepository(this.getOrmRepository(UserOrmEntity));
  }

  static getWalletRepository(): Repository<WalletOrmEntity> {
    return this.getOrmRepository(WalletOrmEntity);
  }
}
