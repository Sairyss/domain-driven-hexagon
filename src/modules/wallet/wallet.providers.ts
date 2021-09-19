import { Provider } from '@nestjs/common';
import { UnitOfWork } from '@src/infrastructure/database/unit-of-work';
import { CreateWalletWhenUserIsCreatedDomainEventHandler } from './application/event-handlers/create-wallet-when-user-is-created.domain-event-handler';

export const createWalletWhenUserIsCreatedProvider: Provider = {
  provide: CreateWalletWhenUserIsCreatedDomainEventHandler,
  useFactory: (): CreateWalletWhenUserIsCreatedDomainEventHandler => {
    const eventHandler = new CreateWalletWhenUserIsCreatedDomainEventHandler(
      new UnitOfWork(),
    );
    eventHandler.listen();
    return eventHandler;
  },
};
