import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './database/user.orm-entity';
import { UserRepository } from './database/user.repository';
import { CreateUserHttpController } from './commands/create-user/create-user.http.controller';
import { FindUserByEmailHttpController } from './queries/find-user-by-email/find-user-by-email.http.controller';
import { DeleteUserHttpController } from './commands/delete-user/delete-user.controller';
import {
  createUserCliLoggerProvider,
  createUserProvider,
  removeUserProvider,
} from './user.providers';
import { CreateUserCliController } from './commands/create-user/create-user.cli.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [
    CreateUserHttpController,
    DeleteUserHttpController,
    FindUserByEmailHttpController,
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
