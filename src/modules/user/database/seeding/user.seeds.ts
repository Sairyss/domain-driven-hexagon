import { NonFunctionProperties } from 'src/core/types';
import { createdAtUpdatedAtMock } from 'src/infrastructure/mocks/generic-model-props.mock';
import { UserOrmEntity } from '../user.orm-entity';

export const userSeeds: NonFunctionProperties<UserOrmEntity>[] = [
  {
    ...createdAtUpdatedAtMock,
    id: '675b5c6f-52de-474f-aba6-f7717844a5e8',
    email: 'john-doe@gmail.com',
    country: 'London',
    postalCode: '23321',
    street: 'Abbey Road',
  },
  {
    ...createdAtUpdatedAtMock,
    id: 'a877f456-3284-42d1-b426-4c5f44eca561',
    email: 'jane-doe@gmail.com',
    country: 'Spain',
    postalCode: '28034',
    street: 'Plaza Mayor',
  },
];
