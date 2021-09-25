import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './database/user.orm-entity';
import { UserRepository } from './database/user.repository';
import { CreateUserHttpController } from './commands/create-user/create-user.http.controller';
import { DeleteUserHttpController } from './commands/delete-user/delete-user.http-controller';
import { createUserCliLoggerProvider } from './user.providers';
import { CreateUserCliController } from './commands/create-user/create-user.cli.controller';
import { FindUsersHttpController } from './queries/find-users/find-users.http.controller';
import { CreateUserMessageController } from './commands/create-user/create-user.message.controller';
import { CreateUserGraphqlResolver } from './commands/create-user/create-user.graphql-resolver';
import { FindUsersGraphqlResolver } from './queries/find-users/find-users.gralhql-resolver';
import { CreateUserService } from './commands/create-user/create-user.service';
import { DeleteUserService } from './commands/delete-user/delete-user.service';

const httpControllers = [
  CreateUserHttpController,
  DeleteUserHttpController,
  FindUsersHttpController,
];

const messageControllers = [CreateUserMessageController];

const cliControllers = [CreateUserCliController];

const graphqlResolvers = [CreateUserGraphqlResolver, FindUsersGraphqlResolver];

const repositories = [UserRepository];

const services = [CreateUserService, DeleteUserService];

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [...httpControllers, ...messageControllers],
  providers: [
    ...cliControllers,
    ...repositories,
    ...graphqlResolvers,
    ...services,
    createUserCliLoggerProvider,
  ],
})
export class UserModule {}
