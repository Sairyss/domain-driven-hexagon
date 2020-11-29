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
  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @IsAlpha()
  @MaxLength(30)
  country!: string;

  @ApiProperty()
  @IsAlphanumeric()
  @MaxLength(10)
  postalCode!: string;

  @ApiProperty()
  @IsAlphanumeric()
  @MaxLength(30)
  street!: string;
}
