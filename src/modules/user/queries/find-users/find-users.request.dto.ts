import { ApiProperty } from '@nestjs/swagger';
import {
  MaxLength,
  IsString,
  IsAlphanumeric,
  Matches,
  IsOptional,
} from 'class-validator';
import { FindUsers } from '@src/interface-adapters/interfaces/user/find-users.interface';

export class FindUsersRequest implements FindUsers {
  @ApiProperty({ example: 'France', description: 'Country of residence' })
  @MaxLength(50)
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z ]*$/)
  readonly country: string;

  @ApiProperty({ example: '28566', description: 'Postal code' })
  @IsOptional()
  @MaxLength(10)
  @IsAlphanumeric()
  readonly postalCode: string;

  @ApiProperty({ example: 'Grande Rue', description: 'Street' })
  @IsOptional()
  @MaxLength(50)
  @Matches(/^[a-zA-Z ]*$/)
  readonly street: string;
}

export class FindUsersHttpRequest extends FindUsersRequest
  implements FindUsers {}
