import { Logger, Module, Provider } from '@nestjs/common';
import { CreateWalletWhenUserIsCreatedDomainEventHandler } from './application/event-handlers/create-wallet-when-user-is-created.domain-event-handler';
import { WalletRepository } from './database/wallet.repository';
import { WALLET_REPOSITORY } from './wallet.di-tokens';
import { WalletMapper } from './wallet.mapper';

const eventHandlers: Provider[] = [
  CreateWalletWhenUserIsCreatedDomainEventHandler,
];

const mappers: Provider[] = [WalletMapper];

const repositories: Provider[] = [
  { provide: WALLET_REPOSITORY, useClass: WalletRepository },
];

@Module({
  imports: [],
  controllers: [],
  providers: [Logger, ...eventHandlers, ...mappers, ...repositories],
})
export class WalletModule {}
