import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletOrmEntity } from './database/wallet.orm-entity';
import { WalletRepository } from './database/wallet.repository';
import { createWalletWhenUserIsCreatedProvider } from './wallet.providers';

@Module({
  imports: [TypeOrmModule.forFeature([WalletOrmEntity])],
  controllers: [],
  providers: [WalletRepository, createWalletWhenUserIsCreatedProvider],
})
export class WalletModule {}
