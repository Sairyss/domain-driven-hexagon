import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'user',
  password: 'password',
  database: 'test-db',
  entities: [],
  autoLoadEntities: true,
  // synchronize: true,
  logging: ['error', 'migration', 'schema'],
};
