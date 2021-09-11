// Query is a plain object with properties
export class FindUsersQuery {
  constructor(props: FindUsersQuery) {
    this.country = props.country;
    this.postalCode = props.postalCode;
    this.street = props.street;
  }

  readonly country: string;

  readonly postalCode: string;

  readonly street: string;
}
