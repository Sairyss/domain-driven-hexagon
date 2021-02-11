import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './database/user.orm-entity';
import { UserRepository } from './database/user.repository';
import { CreateUserHttpController } from './use-cases/create-user/create-user.http.controller';
import { FindUserByEmailHttpController } from './use-cases/find-user-by-email/find-user-by-email.http.controller';
import { DeleteUserHttpController } from './use-cases/remove-user/delete-user.controller';
import { createUserProvider, removeUserProvider } from './user.providers';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [
    CreateUserHttpController,
    DeleteUserHttpController,
    FindUserByEmailHttpController,
  ],
  providers: [UserRepository, createUserProvider, removeUserProvider],
})
export class UserModule {}
