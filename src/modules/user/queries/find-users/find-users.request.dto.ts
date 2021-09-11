import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, IsString, IsAlpha, IsAlphanumeric } from 'class-validator';
import { FindUsers } from 'src/interface-adapters/interfaces/user/find-users.interface';

export class FindUsersRequest implements FindUsers {
  @ApiProperty({ example: 'France', description: 'Country of residence' })
  @MaxLength(50)
  @IsString()
  @IsAlpha()
  readonly country: string;

  @ApiProperty({ example: '28566', description: 'Postal code' })
  @MaxLength(10)
  @IsAlphanumeric()
  readonly postalCode: string;

  @ApiProperty({ example: 'Grande Rue', description: 'Street' })
  @MaxLength(50)
  @IsAlphanumeric()
  readonly street: string;
}

export class FindUsersHttpRequest extends FindUsersRequest
  implements FindUsers {}
