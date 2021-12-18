import { UserRoles } from '@modules/user/domain/entities/user.types';
import { NonFunctionProperties } from '@libs/types';
import { createdAtUpdatedAtMock } from '@src/libs/test-utils/mocks/generic-model-props.mock';
import { UserOrmEntity } from '../user.orm-entity';

/**
 * Seeding database with dummy data
 * https://github.com/Sairyss/backend-best-practices#data-seeding
 */
export const userSeeds: NonFunctionProperties<UserOrmEntity>[] = [
  {
    ...createdAtUpdatedAtMock,
    id: '675b5c6f-52de-474f-aba6-f7717844a5e8',
    email: 'john-doe@gmail.com',
    country: 'London',
    postalCode: '23321',
    street: 'Abbey Road',
    role: UserRoles.guest,
  },
  {
    ...createdAtUpdatedAtMock,
    id: 'a877f456-3284-42d1-b426-4c5f44eca561',
    email: 'jane-doe@gmail.com',
    country: 'Spain',
    postalCode: '28034',
    street: 'Plaza Mayor',
    role: UserRoles.guest,
  },
];
