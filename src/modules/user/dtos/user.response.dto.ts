import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { ResponseBase } from 'src/interface-adapters/base-classes/response.base';
import { User } from 'src/interface-adapters/interfaces/user/user.interface';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponse extends ResponseBase implements User {
  constructor(user: UserEntity) {
    super(user);
    this.email = user.email.value;
    this.country = user.address.country;
    this.postalCode = user.address.postalCode;
    this.street = user.address.street;
  }

  @ApiProperty({
    example: 'joh-doe@gmail.com',
    description: "User's email address",
  })
  email: string;

  @ApiProperty({
    example: 'France',
    description: "User's country of residence",
  })
  country: string;

  @ApiProperty({
    example: '123456',
    description: 'Postal code',
  })
  postalCode: string;

  @ApiProperty({
    example: 'Park Avenue',
    description: 'Street where the user is registered',
  })
  street: string;
}
