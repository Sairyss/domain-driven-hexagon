import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class IdGqlResponse {
  constructor(id: string) {
    this.id = id;
  }

  @Field()
  readonly id: string;
}
