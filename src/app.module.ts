import { Module } from '@nestjs/common';
import { UserModule } from '@modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestEventModule } from 'nest-event';
import { ConsoleModule } from 'nestjs-console';
import { WalletModule } from '@modules/wallet/wallet.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { typeormConfig } from './infrastructure/configs/ormconfig';
import { UnitOfWorkModule } from './infrastructure/database/unit-of-work/unit-of-work.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    // only if you are using GraphQL
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/infrastructure/schema.gql'),
    }),
    UnitOfWorkModule,
    NestEventModule,
    ConsoleModule,
    UserModule,
    WalletModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
