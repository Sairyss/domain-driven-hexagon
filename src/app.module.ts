import { Module } from '@nestjs/common';
import { UserModule } from '@modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestEventModule } from 'nest-event';
import { ConsoleModule } from 'nestjs-console';
import { WalletModule } from '@modules/wallet/wallet.module';
import { typeormConfig } from './infrastructure/configs/ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    NestEventModule,
    ConsoleModule,
    UserModule,
    WalletModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
