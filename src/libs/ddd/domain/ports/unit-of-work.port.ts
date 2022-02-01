import { UserRepositoryPort } from "@modules/user/database/user.repository.port";
import {WalletRepositoryPort} from "@modules/wallet/database/wallet.repository.port";

export interface UnitOfWorkExecution {
  execute<T>(
      correlationId: string,
      callback: () => Promise<T>,
      options?: unknown,
  ): Promise<T>;
}


export interface UnitOfWorkPort extends UnitOfWorkExecution{
  getUserRepository(correlationId: string): UserRepositoryPort
  getWalletRepository(correlationId: string): WalletRepositoryPort
}
