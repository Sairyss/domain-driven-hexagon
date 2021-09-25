import { Query } from '@libs/ddd/domain/base-classes/query-handler.base';

// Query is a plain object with properties
export class FindUsersQuery extends Query {
  constructor(props: FindUsersQuery) {
    super();
    this.country = props.country;
    this.postalCode = props.postalCode;
    this.street = props.street;
  }

  readonly country?: string;

  readonly postalCode?: string;

  readonly street?: string;
}
