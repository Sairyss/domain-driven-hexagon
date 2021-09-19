import { UserCreatedDomainEvent } from '@modules/user/domain/events/user-created.domain-event';
import { WalletRepositoryPort } from '@modules/wallet/database/wallet.repository.port';
import { DomainEventHandler } from 'src/core/domain-events';
import { UUID } from 'src/core/value-objects/uuid.value-object';
import { WalletEntity } from '../entities/wallet.entity';

export class OnUserCreatedDomainEventHandler extends DomainEventHandler {
  constructor(private readonly walletRepo: WalletRepositoryPort) {
    super(UserCreatedDomainEvent);
  }

  // Do changes to other aggregates or prepare Integration Event for dispatching.
  async handle(event: UserCreatedDomainEvent): Promise<void> {
    const wallet = WalletEntity.create({
      userId: new UUID(event.aggregateId),
    });
    await this.walletRepo.save(wallet);
  }
}
