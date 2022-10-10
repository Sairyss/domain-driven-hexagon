import { RepositoryPort } from '@libs/ddd';
import { WalletEntity } from '../domain/wallet.entity';

export type WalletRepositoryPort = RepositoryPort<WalletEntity>;
