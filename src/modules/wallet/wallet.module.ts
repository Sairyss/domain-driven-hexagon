import { Logger, Module } from '@nestjs/common';
import { CreateWalletWhenUserIsCreatedDomainEventHandler } from './application/event-handlers/create-wallet-when-user-is-created.domain-event-handler';
import { WalletRepository } from './database/wallet.repository';
import { WalletMapper } from './wallet.mapper';

@Module({
  imports: [],
  controllers: [],
  providers: [
    CreateWalletWhenUserIsCreatedDomainEventHandler,
    WalletRepository,
    WalletMapper,
    Logger,
  ],
})
export class WalletModule {}
