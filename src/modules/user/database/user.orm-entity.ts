import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { Address } from '@modules/user/domain/value-objects/address.value-object';
import { Email } from '@modules/user/domain/value-objects/email.value-object';
import { Column, Entity } from 'typeorm';
import { OrmEntityBase } from '../../../infrastructure/database/base-classes/orm-entity.base';

@Entity('user')
export class UserOrmEntity extends OrmEntityBase<UserEntity> {
  @Column({ unique: true })
  email!: string;

  @Column()
  country!: string;

  @Column()
  postalCode!: string;

  @Column()
  street!: string;

  toPersistence(user: UserEntity): UserOrmEntity {
    this.email = user.email.value;
    this.postalCode = user.address.postalCode;
    this.country = user.address.country;
    this.street = user.address.street;

    return this;
  }

  toDomain(): UserEntity {
    const user = new UserEntity({
      ...this.toDomainBaseProps(),
      email: new Email(this.email),
      address: new Address({
        postalCode: this.postalCode,
        country: this.country,
        street: this.street,
      }),
    });
    return user;
  }
}
