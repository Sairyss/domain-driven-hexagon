import { Mapper } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { WalletEntity } from './domain/wallet.entity';
import { WalletModel, walletSchema } from './database/wallet.repository';

@Injectable()
export class WalletMapper implements Mapper<WalletEntity, WalletModel> {
  toPersistence(entity: WalletEntity): WalletModel {
    const copy = entity.getProps();
    const record: WalletModel = {
      id: copy.id,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt,
      userId: copy.userId,
      balance: copy.balance,
    };
    return walletSchema.parse(record);
  }

  toDomain(record: WalletModel): WalletEntity {
    const entity = new WalletEntity({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        userId: record.userId,
        balance: record.balance,
      },
    });
    return entity;
  }

  toResponse(): any {
    throw new Error('Not implemented');
  }
}
