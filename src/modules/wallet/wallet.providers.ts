import { Provider } from '@nestjs/common';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work/unit-of-work';
import { CreateWalletWhenUserIsCreatedDomainEventHandler } from './application/event-handlers/create-wallet-when-user-is-created.domain-event-handler';

export const createWalletWhenUserIsCreatedProvider: Provider = {
  provide: CreateWalletWhenUserIsCreatedDomainEventHandler,
  useFactory: (
    unitOfWork: UnitOfWork,
  ): CreateWalletWhenUserIsCreatedDomainEventHandler => {
    const eventHandler = new CreateWalletWhenUserIsCreatedDomainEventHandler(
      unitOfWork,
    );
    eventHandler.listen();
    return eventHandler;
  },
  inject: [UnitOfWork],
};
