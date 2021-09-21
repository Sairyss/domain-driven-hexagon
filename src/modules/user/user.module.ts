import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './database/user.orm-entity';
import { UserRepository } from './database/user.repository';
import { CreateUserHttpController } from './commands/create-user/create-user.http.controller';
import { DeleteUserHttpController } from './commands/delete-user/delete-user.http-controller';
import {
  createUserCliLoggerProvider,
  createUserProvider,
  removeUserProvider,
} from './user.providers';
import { CreateUserCliController } from './commands/create-user/create-user.cli.controller';
import { FindUsersHttpController } from './queries/find-users/find-users.http.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [
    CreateUserHttpController,
    DeleteUserHttpController,
    FindUsersHttpController,
  ],
  providers: [
    UserRepository,
    createUserProvider,
    removeUserProvider,
    CreateUserCliController,
    createUserCliLoggerProvider,
  ],
})
export class UserModule {}
