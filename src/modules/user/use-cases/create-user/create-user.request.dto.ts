import { CreateUser } from 'src/interface-adapters/interfaces/user/create.user.interface';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlpha,
  IsAlphanumeric,
  IsEmail,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUserRequest implements CreateUser {
  @ApiProperty({
    example: 'john@gmail.com',
    description: 'User email address',
  })
  @MaxLength(320)
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'France', description: 'Country of residence' })
  @MaxLength(50)
  @IsString()
  @IsAlpha()
  country!: string;

  @ApiProperty({ example: '28566', description: 'Postal code' })
  @MaxLength(10)
  @IsAlphanumeric()
  postalCode!: string;

  @ApiProperty({ example: 'Grande Rue', description: 'Street' })
  @MaxLength(50)
  @IsAlphanumeric()
  street!: string;
}
