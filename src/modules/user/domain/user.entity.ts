import { AggregateRoot, AggregateID } from '@libs/ddd';
import { UserCreatedDomainEvent } from './events/user-created.domain-event';
import { Address, AddressProps } from './value-objects/address.value-object';
import {
  CreateUserProps,
  UpdateUserAddressProps,
  UserProps,
  UserRoles,
} from './user.types';
import { UserDeletedDomainEvent } from './events/user-deleted.domain-event';
import { UserRoleChangedDomainEvent } from './events/user-role-changed.domain-event';
import { UserAddressUpdatedDomainEvent } from './events/user-address-updated.domain-event';
import { randomUUID } from 'crypto';

export class UserEntity extends AggregateRoot<UserProps> {
  protected readonly _id: AggregateID;

  static create(create: CreateUserProps): UserEntity {
    const id = randomUUID();
    /* Setting a default role since we are not accepting it during creation. */
    const props: UserProps = { ...create, role: UserRoles.guest };
    const user = new UserEntity({ id, props });
    /* adding "UserCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    user.addEvent(
      new UserCreatedDomainEvent({
        aggregateId: id,
        email: props.email,
        ...props.address.unpack(),
      }),
    );
    return user;
  }

  /* You can create getters only for the properties that you need to
  access and leave the rest of the properties private to keep entity
  encapsulated. To get all entity properties (for saving it to a
  database or mapping a response) use .getProps() method
  defined in a EntityBase parent class */
  get role(): UserRoles {
    return this.props.role;
  }

  private changeRole(newRole: UserRoles): void {
    this.addEvent(
      new UserRoleChangedDomainEvent({
        aggregateId: this.id,
        oldRole: this.props.role,
        newRole,
      }),
    );

    this.props.role = newRole;
  }

  makeAdmin(): void {
    this.changeRole(UserRoles.admin);
  }

  makeModerator(): void {
    this.changeRole(UserRoles.moderator);
  }

  delete(): void {
    this.addEvent(
      new UserDeletedDomainEvent({
        aggregateId: this.id,
      }),
    );
  }

  /* Update method only changes properties that we allow, in this
   case only address. This prevents from illegal actions, 
   for example setting email from outside by doing something
   like user.email = otherEmail */
  updateAddress(props: UpdateUserAddressProps): void {
    const newAddress = new Address({
      ...this.props.address,
      ...props,
    } as AddressProps);

    this.props.address = newAddress;

    this.addEvent(
      new UserAddressUpdatedDomainEvent({
        aggregateId: this.id,
        country: newAddress.country,
        street: newAddress.street,
        postalCode: newAddress.postalCode,
      }),
    );
  }

  validate(): void {
    // entity business rules validation to protect it's invariant before saving entity to a database
  }
}
