import { Seeder, Factory } from 'typeorm-seeding';
import { UserOrmEntity } from '../user.orm-entity';
import { userSeeds } from './user.seeds';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await Promise.all(
      userSeeds.map(seed => factory(UserOrmEntity)().create(seed)),
    );
  }
}
