import { Field, ObjectType } from '@nestjs/graphql';
import { PaginatedGraphqlResponse } from '../../../../libs/api/graphql/paginated.graphql-response.base';

import { UserGraphqlResponseDto } from './user.graphql-response.dto';

@ObjectType()
export class UserPaginatedGraphqlResponseDto extends PaginatedGraphqlResponse(
  UserGraphqlResponseDto,
) {
  @Field(() => [UserGraphqlResponseDto])
  data: UserGraphqlResponseDto[];
}
