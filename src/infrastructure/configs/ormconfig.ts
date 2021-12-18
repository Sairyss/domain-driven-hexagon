import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { get } from 'env-var';

// https://github.com/Sairyss/backend-best-practices#configuration

// Initializing dotenv
config();

/**
 * Making sure all environmental variables
 * exist and are validated.
 */
class DatabaseConfig {
  public static readonly DB_HOST: string = get('DB_HOST')
    .required()
    .asString();

  public static readonly DB_NAME: string = get('DB_NAME')
    .required()
    .asString();

  public static readonly DB_PORT: number = get('DB_PORT')
    .required()
    .asIntPositive();

  public static readonly DB_USERNAME: string = get('DB_USERNAME')
    .required()
    .asString();

  public static readonly DB_PASSWORD: string = get('DB_PASSWORD')
    .required()
    .asString();
}

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: DatabaseConfig.DB_HOST,
  port: DatabaseConfig.DB_PORT,
  username: DatabaseConfig.DB_USERNAME,
  password: DatabaseConfig.DB_PASSWORD,
  database: DatabaseConfig.DB_NAME,
  entities: [],
  autoLoadEntities: true,
  connectTimeoutMS: 2000,
  logging: ['error', 'migration', 'schema'],
};
