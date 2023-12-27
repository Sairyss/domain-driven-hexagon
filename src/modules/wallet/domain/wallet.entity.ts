import { AggregateID, AggregateRoot } from '@libs/ddd';
import { ArgumentOutOfRangeException } from '@libs/exceptions';
import { Err, Ok, Result } from 'oxide.ts';
import { WalletCreatedDomainEvent } from './events/wallet-created.domain-event';
import { WalletNotEnoughBalanceError } from './wallet.errors';
import { randomUUID } from 'crypto';

export interface CreateWalletProps {
  userId: AggregateID;
}

export interface WalletProps extends CreateWalletProps {
  balance: number;
}

export class WalletEntity extends AggregateRoot<WalletProps> {
  protected readonly _id: AggregateID;

  static create(create: CreateWalletProps): WalletEntity {
    const id = randomUUID();
    const props: WalletProps = { ...create, balance: 0 };
    const wallet = new WalletEntity({ id, props });

    wallet.addEvent(
      new WalletCreatedDomainEvent({ aggregateId: id, userId: create.userId }),
    );

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
