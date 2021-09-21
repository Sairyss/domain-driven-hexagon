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
import { CreateUserMessageController } from './commands/create-user/create-user.message.controller';
import { CreateUserGraphqlResolver } from './commands/create-user/create-user.graphql-resolver';
import { FindUsersGraphqlResolver } from './queries/find-users/find-users.gralhql-resolver';

const httpControllers = [
  CreateUserHttpController,
  DeleteUserHttpController,
  FindUsersHttpController,
];

const messageControllers = [CreateUserMessageController];

const cliControllers = [CreateUserCliController];

const graphqlResolvers = [CreateUserGraphqlResolver, FindUsersGraphqlResolver];

const repositories = [UserRepository];

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [...httpControllers, ...messageControllers],
  providers: [
    ...cliControllers,
    ...repositories,
    ...graphqlResolvers,
    createUserProvider,
    removeUserProvider,
    createUserCliLoggerProvider,
  ],
})
export class UserModule {}
