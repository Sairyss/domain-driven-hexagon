import { ApiProperty } from '@nestjs/swagger';
import { Id } from '../interfaces/id.interface';

export class IdResponse implements Id {
  constructor(id: string) {
    this.id = id;
  }

  @ApiProperty({ example: '2cdc8ab1-6d50-49cc-ba14-54e4ac7ec231' })
  id: string;
}
