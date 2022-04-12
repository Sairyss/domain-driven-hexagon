import { ArgumentOutOfRangeException } from '@libs/exceptions';
import { AggregateRoot } from '@libs/ddd/domain/base-classes/aggregate-root.base';
import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';
import { Err, Ok, Result } from 'oxide.ts/dist';
import { WalletNotEnoughBalanceError } from '../../errors/wallet.errors';

export interface CreateWalletProps {
  userId: UUID;
}

export interface WalletProps extends CreateWalletProps {
  balance: number;
}

export class WalletEntity extends AggregateRoot<WalletProps> {
  protected readonly _id: UUID;

  static create(create: CreateWalletProps): WalletEntity {
    const id = UUID.generate();
    const props: WalletProps = { ...create, balance: 0 };
    const wallet = new WalletEntity({ id, props });

    return wallet;
  }

  deposit(amount: number): void {
    this.props.balance += amount;
  }

  withdraw(amount: number): Result<null, WalletNotEnoughBalanceError> {
    if (this.props.balance - amount < 0) {
      return Err(new WalletNotEnoughBalanceError());
    }
    this.props.balance -= amount;
    return Ok(null);
  }

  /**
   * Protects wallet invariant.
   * This method is executed by a repository
   * before saving entity in a database.
   */
  public validate(): void {
    if (this.props.balance < 0) {
      throw new ArgumentOutOfRangeException(
        'Wallet balance cannot be less than 0',
      );
    }
  }
}
