import { ResponseBase } from '@libs/api/response.base';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserGraphqlResponseDto extends ResponseBase {
  @Field({
    description: "User's identifier",
  })
  id: string;

  @Field({
    description: "User's email address",
  })
  email: string;

  @Field({
    description: "User's country of residence",
  })
  country: string;

  @Field({
    description: 'Postal code',
  })
  postalCode: string;

  @Field({
    description: 'Street where the user is registered',
  })
  street: string;
}
