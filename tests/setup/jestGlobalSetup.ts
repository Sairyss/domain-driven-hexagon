import { databaseConfig } from '../../src/configs/database.config';

module.exports = async (): Promise<void> => {
  if (!databaseConfig.database.includes('test')) {
    throw new Error(
      `Current database name is: ${databaseConfig.database}. Make sure database includes a word "test" as prefix or suffix, for example: "test_db" or "db_test" to avoid writing into a main database.`,
    );
  }
};
