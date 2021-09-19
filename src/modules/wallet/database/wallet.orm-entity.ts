import { TypeormEntityBase } from '@libs/ddd/infrastructure/database/base-classes/typeorm.entity.base';
import { Column, Entity } from 'typeorm';

@Entity('wallet')
export class WalletOrmEntity extends TypeormEntityBase {
  constructor(props?: WalletOrmEntity) {
    super(props);
  }

  @Column({ default: 0 })
  balance: number;

  @Column({ unique: true })
  userId: string;
}
