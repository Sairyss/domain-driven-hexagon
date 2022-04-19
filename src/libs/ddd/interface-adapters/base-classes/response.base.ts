import { BaseEntityProps } from '@libs/ddd/domain/base-classes/entity.base';
import { ApiProperty } from '@nestjs/swagger';
import { IdResponse } from '../dtos/id.response.dto';

/**
 * Most of our response objects will have properties like
 * id, createdAt and updatedAt so we can move them to a
 * separate class and extend it to avoid duplication.
 */
export class ResponseBase extends IdResponse {
  constructor(entity: BaseEntityProps) {
    super(entity.id.value);
    this.createdAt = entity.createdAt.value.toISOString();
    this.updatedAt = entity.updatedAt.value.toISOString();
  }

  @ApiProperty({ example: '2020-11-24T17:43:15.970Z' })
  readonly createdAt: string;

  @ApiProperty({ example: '2020-11-24T17:43:15.970Z' })
  readonly updatedAt: string;
}
