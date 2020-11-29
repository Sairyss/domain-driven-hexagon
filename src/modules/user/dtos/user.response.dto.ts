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
    this.street = user.address.postalCode;
  }

  @ApiProperty({ example: 'joh-doe@gmail.com' })
  email: string;

  @ApiProperty({ example: 'France' })
  country: string;

  @ApiProperty({ example: '123456' })
  postalCode: string;

  @ApiProperty({ example: 'Park Avenue' })
  street: string;
}
