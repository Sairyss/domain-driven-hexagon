import { defineFeature, loadFeature } from 'jest-cucumber';
import * as request from 'supertest';
import { CreateUser } from '@src/interface-adapters/interfaces/user/create.user.interface';
import { Id } from '@src/libs/ddd/interface-adapters/interfaces/id.interface';
import { UserResponse } from '@src/modules/user/dtos/user.response.dto';
import { snapshotBaseProps } from '@src/libs/test-utils/snapshot-base-props';
import { getTestServer, TestServer } from '../../jestSetupAfterEnv';

const feature = loadFeature('tests/user/create-user/create-user.feature');

/**
 * e2e test implementing a Gherkin feature file
 * https://github.com/Sairyss/backend-best-practices#testing
 */

defineFeature(feature, test => {
  let testServer: TestServer;
  let httpServer: request.SuperTest<request.Test>;

  beforeAll(() => {
    testServer = getTestServer();
    httpServer = request(testServer.serverApplication.getHttpServer());
  });

  afterAll(() => {
    // TODO: clean db after tests are finished
  });

  test('Creating a user happy path', ({ given, when, then, and }) => {
    const userDto: Partial<CreateUser> = {};
    let userId: Id;

    given(/^that my email is "(.*)"$/, (email: string) => {
      userDto.email = email;
    });

    and(
      /^my country is "(.*)", my postal code is "(.*)" and my street is "(.*)"$/,
      (country: string, postalCode: string, street: string) => {
        userDto.country = country;
        userDto.postalCode = postalCode;
        userDto.street = street;
      },
    );

    when('I send a request to create a user', async () => {
      const res = await httpServer
        .post('/v1/users')
        .send(userDto)
        .expect(201);
      userId = res.body;
    });

    then('I receive my user ID', () => {
      expect(userId).toMatchSnapshot({ id: expect.any(String) });
    });

    and('I can see my user in a list of all users', async () => {
      const res = await httpServer.get('/v1/users').expect(200);

      expect(res.body).toMatchSnapshot([snapshotBaseProps]);
      expect(res.body.some((item: UserResponse) => item.id === userId.id)).toBe(
        true,
      );
    });
  });
});
