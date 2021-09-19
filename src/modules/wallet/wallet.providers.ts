import { Provider } from '@nestjs/common';
import { CreateUserUoW } from 'src/infrastructure/database/units-of-work';
import { WalletRepository } from './database/wallet.repository';
import { OnUserCreatedDomainEventHandler } from './domain/event-handlers/on-user-created.event-handler';

export const createWalletWhenUserIsCreatedProvider: Provider = {
  provide: OnUserCreatedDomainEventHandler,
  useFactory: (): OnUserCreatedDomainEventHandler => {
    /**
     * Creating event handler with a transactional repository
     * provided by a UnitOfWork so all the changes across the domain
     * are saved in a single transaction (or rolled back in case of failure).
     */
    CreateUserUoW.init();
    const walletOrmRepo = CreateUserUoW.getWalletRepository();
    const walletRepo = new WalletRepository(walletOrmRepo);
    const eventHandler = new OnUserCreatedDomainEventHandler(walletRepo);
    eventHandler.listen();
    return eventHandler;
  },
  inject: [WalletRepository],
};
