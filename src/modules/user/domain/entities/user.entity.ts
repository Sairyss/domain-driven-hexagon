import { AggregateRoot } from '@libs/ddd/domain/base-classes/aggregate-root.base';
import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';
import { UserCreatedDomainEvent } from '../events/user-created.domain-event';
import { Address, AddressProps } from '../value-objects/address.value-object';
import { Email } from '../value-objects/email.value-object';
import { UpdateUserAddressProps, UserRoles } from './user.types';

// Properties that are needed for a user creation
export interface CreateUserProps {
  email: Email;
  address: Address;
}

// All properties that a User has
export interface UserProps extends CreateUserProps {
  role: UserRoles;
}

export class UserEntity extends AggregateRoot<UserProps> {
  protected readonly _id: UUID;

  static create(create: CreateUserProps): UserEntity {
    const id = UUID.generate();
    /* Setting a default role since we are not accepting it during creation. */
    const props: UserProps = { ...create, role: UserRoles.guest };
    const user = new UserEntity({ id, props });
    /* adding "UserCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action */
    user.addEvent(
      new UserCreatedDomainEvent({
        aggregateId: id.value,
        email: props.email.unpack(),
        ...props.address.unpack(),
      }),
    );
    return user;
  }

  /* You can create getters only for the properties that you need to access and leave the rest of the properties private to keep entity
  encapsulated. To get all entity properties (for saving it to a
  database or mapping a response) use .getPropsCopy() method
  defined in a EntityBase parent class */
  get role(): UserRoles {
    return this.props.role;
  }

  makeAdmin(): void {
    this.props.role = UserRoles.admin;
  }

  makeModerator(): void {
    this.props.role = UserRoles.moderator;
  }

  /* Update method only changes properties that we allow, in this
   case only address. This prevents from illegal actions, 
   for example setting email from outside by doing something
   like user.email = otherEmail */
  updateAddress(props: UpdateUserAddressProps): void {
    this.props.address = new Address({
      ...this.props.address,
      ...props,
    } as AddressProps);

    // Note: AddressUpdatedDomainEvent can be emitted here if needed.
  }

  someBusinessLogic(): void {
    // TODO: add example business logic
  }

  validate(): void {
    // TODO: example
    // entity business rules validation to protect it's invariant
  }
}
