import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, IsEmail } from 'class-validator';
import { FindUserByEmail } from 'src/interface-adapters/interfaces/user/find-user-by-email.interface';

export class FindUserByEmailRequest implements FindUserByEmail {
  @ApiProperty({
    example: 'john@gmail.com',
    description: 'User email address',
    required: true,
  })
  @MaxLength(320)
  @IsEmail()
  email!: string;
}
