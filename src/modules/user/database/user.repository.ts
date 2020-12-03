import { RepositoryBase } from 'src/infrastructure/database/base-classes/repository.base';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { NotFoundException } from '@exceptions';
import { OrmEntityBase } from 'src/infrastructure/database/base-classes/orm-entity.base';
import { UserOrmEntity } from './user.orm-entity';
import { UserRepositoryPort } from './user.repository.interface';

@Injectable()
export class UserRepository extends RepositoryBase<UserEntity>
  implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
  ) {
    super(userRepository, UserOrmEntity);
  }

  private async findOneByEmail(
    email: string,
  ): Promise<OrmEntityBase<UserEntity> | undefined> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }

  async findOneByEmailOrThrow(email: string): Promise<UserEntity> {
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException();
    }
    return user.toDomain();
  }

  async exists(email: string): Promise<boolean> {
    const found = this.findOneByEmail(email);
    if (found) {
      return true;
    }
    return false;
  }
}
