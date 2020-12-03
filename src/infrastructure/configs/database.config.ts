import { typeormConfig } from './ormconfig';

const database = {
  ...typeormConfig,
  entities: ['src/**/*.orm-entity.ts'],
  migrationsTableName: 'migrations',
  migrations: ['src/**/migrations/*.ts'],
  seeds: ['src/**/seeders/**/*.seeder.ts'],
  factories: ['src/**/factories/**/*.ts'],
  cli: {
    migrationsDir: `src/infrastructure/database/migrations`,
  },
};

export = database;
