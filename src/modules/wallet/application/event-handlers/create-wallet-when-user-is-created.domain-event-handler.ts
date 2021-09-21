import { UserCreatedDomainEvent } from '@modules/user/domain/events/user-created.domain-event';
import { WalletRepositoryPort } from '@modules/wallet/database/wallet.repository.port';
import { DomainEventHandler } from '@libs/ddd/domain/domain-events';
import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { WalletEntity } from '../../domain/entities/wallet.entity';

export class CreateWalletWhenUserIsCreatedDomainEventHandler extends DomainEventHandler {
  constructor(private readonly unitOfWork: UnitOfWork) {
    super(UserCreatedDomainEvent);
  }

  // Handle a Domain Event by perform changes to other aggregates (inside the same Domain).
  async handle(event: UserCreatedDomainEvent): Promise<void> {
    const walletRepo: WalletRepositoryPort = this.unitOfWork.getWalletRepository(
      event.correlationId,
    );
    const wallet = WalletEntity.create({
      userId: new UUID(event.aggregateId),
    });
    await walletRepo.save(wallet);
  }
}
