import { Provider } from '@nestjs/common';
import { CreateUserUoW } from 'src/infrastructure/database/units-of-work';
import { WalletRepository } from './database/wallet.repository';
import { CreateWalletWhenUserIsCreatedDomainEventHandler } from './application/event-handlers/create-wallet-when-user-is-created.domain-event-handler';

export const createWalletWhenUserIsCreatedProvider: Provider = {
  provide: CreateWalletWhenUserIsCreatedDomainEventHandler,
  useFactory: (): CreateWalletWhenUserIsCreatedDomainEventHandler => {
    /**
     * Creating event handler with a transactional repository
     * provided by a UnitOfWork so all the changes across the domain
     * are saved in a single transaction (or rolled back in case of failure).
     */
    CreateUserUoW.init();
    const walletRepo = CreateUserUoW.getWalletRepository();
    const eventHandler = new CreateWalletWhenUserIsCreatedDomainEventHandler(
      walletRepo,
    );
    eventHandler.listen();
    return eventHandler;
  },
  inject: [WalletRepository],
};
