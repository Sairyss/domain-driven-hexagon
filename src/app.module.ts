import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestEventModule } from 'nest-event';
import { UserRepository } from '@modules/user/database/user.repository';
import { UserOrmEntity } from '@modules/user/database/user.orm-entity';
import { typeormConfig } from './infrastructure/configs/ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    TypeOrmModule.forFeature([UserOrmEntity]),
    NestEventModule,
    UserModule,
  ],
  controllers: [],
  providers: [UserRepository],
})
export class AppModule {}
