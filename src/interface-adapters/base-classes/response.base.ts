import { EntityProps } from 'src/domain/base-classes/entity.base';
import { ApiProperty } from '@nestjs/swagger';
import { IdResponseDTO } from '../dtos/id.response.dto';

export class ResponseBase extends IdResponseDTO {
  constructor(entity: EntityProps) {
    super(entity.id?.value as string);
    this.createdAt = (entity.createdAt?.value as Date).toISOString();
    this.updatedAt = (entity.updatedAt?.value as Date).toISOString();
  }

  @ApiProperty({ example: '2020-11-24T17:43:15.970Z' })
  createdAt: string;

  @ApiProperty({ example: '2020-11-24T17:43:15.970Z' })
  updatedAt: string;
}
