import { UnitOfWork } from '@libs/ddd/infrastructure/database/base-classes/unit-of-work.base';
import { UserOrmEntity } from '@modules/user/database/user.orm-entity';
import { UserRepository } from '@modules/user/database/user.repository';
import { WalletOrmEntity } from '@modules/wallet/database/wallet.orm-entity';
import { WalletRepository } from '@modules/wallet/database/wallet.repository';

export class CreateUserUoW extends UnitOfWork {
  static getUserRepository(): UserRepository {
    return new UserRepository(this.getOrmRepository(UserOrmEntity));
  }

  static getWalletRepository(): WalletRepository {
    return new WalletRepository(this.getOrmRepository(WalletOrmEntity));
  }
}
