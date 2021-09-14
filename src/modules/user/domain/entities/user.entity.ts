import { AggregateRoot } from 'src/core/base-classes/aggregate-root.base';
import { UUID } from 'src/core/value-objects/uuid.value-object';
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

  static create(createUser: CreateUserProps): UserEntity {
    const id = UUID.generate();
    // Setting a default role since it is not accepted during creation
    const props: UserProps = { ...createUser, role: UserRoles.guest };
    const user = new UserEntity({ id, props });
    /* adding "UserCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action */
    user.addEvent(
      new UserCreatedDomainEvent({
        aggregateId: id.value,
        email: props.email.getRawProps(),
        ...props.address.getRawProps(),
        dateOccurred: Date.now(),
      }),
    );
    return user;
  }

  /* Private properties and getters without a setter protects entity
  from outside modifications by using assignment, for example:
  "user.email = someOtherEmail". This technique only allows
  updating value by using a dedicated 'update' method (see updateAddress below) */
  get address(): Address {
    return this.props.address;
  }

  get email(): Email {
    return this.props.email;
  }

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
  }

  someBusinessLogic(): void {
    // TODO: add example business logic
  }

  static validate(props: UserProps): void {
    // TODO: example
    // entity business rules validation to protect it's invariant
  }
}
