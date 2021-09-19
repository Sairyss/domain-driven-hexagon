import { RepositoryPort } from '@libs/ddd/domain/ports/repository.ports';
import { WalletEntity, WalletProps } from '../domain/entities/wallet.entity';

export type WalletRepositoryPort = RepositoryPort<WalletEntity, WalletProps>;
