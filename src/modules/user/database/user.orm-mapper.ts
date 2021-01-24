import {
  OrmEntityProps,
  OrmMapper,
} from 'src/infrastructure/database/base-classes/orm-mapper.base';
import { UserEntity, UserProps } from '../domain/entities/user.entity';
import { Address } from '../domain/value-objects/address.value-object';
import { Email } from '../domain/value-objects/email.value-object';
import { UserOrmEntity } from './user.orm-entity';

export class UserOrmMapper extends OrmMapper<UserEntity, UserOrmEntity> {
  protected toOrmProps(entity: UserEntity): OrmEntityProps<UserOrmEntity> {
    const props = entity.getPropsCopy();

    const ormProps: OrmEntityProps<UserOrmEntity> = {
      email: props.email.value,
      country: props.address.country,
      postalCode: props.address.postalCode,
      street: props.address.street,
    };
    return ormProps;
  }

  protected toDomainProps(ormEntity: UserOrmEntity): UserProps {
    const props: UserProps = {
      email: new Email(ormEntity.email),
      address: new Address({
        street: ormEntity.street,
        postalCode: ormEntity.postalCode,
        country: ormEntity.country,
      }),
    };
    return props;
  }
}
