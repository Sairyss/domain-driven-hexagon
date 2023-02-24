import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export interface IPaginatedType<T> {
  data: T[];
  count: number;
  limit: number;
  page: number;
}

export function PaginatedGraphqlResponse<T>(
  classRef: Type<T>,
): Type<IPaginatedType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginatedType<T> {
    constructor(props: IPaginatedType<T>) {
      this.count = props.count;
      this.limit = props.limit;
      this.page = props.page;
      this.data = props.data;
    }
    @Field(() => Int)
    page: number;

    @Field(() => Int)
    count: number;

    @Field()
    limit: number;

    @Field(() => [classRef])
    readonly data: T[];
  }
  return PaginatedType as Type<IPaginatedType<T>>;
}
