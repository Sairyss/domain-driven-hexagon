import { ApiProperty } from '@nestjs/swagger';
import { Field, ObjectType } from '@nestjs/graphql';
import { Id } from '../interfaces/id.interface';

@ObjectType() // <- only if you are using GraphQL
export class IdResponse implements Id {
  constructor(id: string) {
    this.id = id;
  }

  @ApiProperty({ example: '2cdc8ab1-6d50-49cc-ba14-54e4ac7ec231' })
  @Field() // <- only if you are using GraphQL
  readonly id: string;
}
