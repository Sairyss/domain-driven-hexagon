import { RepositoryPort } from 'src/core/ports/repository.ports';
import { WalletEntity, WalletProps } from '../domain/entities/wallet.entity';

export type WalletRepositoryPort = RepositoryPort<WalletEntity, WalletProps>;
