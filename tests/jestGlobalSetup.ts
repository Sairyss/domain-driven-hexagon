import * as dotenv from 'dotenv';
import * as path from 'path';

// This will force dotenv to use environmental variables from ".env.test" instead of ".env"
const envPath: string = path.resolve(__dirname, '../.env.test');
module.exports = async (): Promise<void> => {
  dotenv.config({ path: envPath });
};
