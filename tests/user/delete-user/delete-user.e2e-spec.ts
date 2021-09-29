import { defineFeature, loadFeature } from 'jest-cucumber';
import * as request from 'supertest';
import { CreateUser } from '@src/interface-adapters/interfaces/user/create.user.interface';
import { Id } from '@src/libs/ddd/interface-adapters/interfaces/id.interface';
import { UserResponse } from '@src/modules/user/dtos/user.response.dto';
import { getTestServer, TestServer } from '../../jestSetupAfterEnv';

const feature = loadFeature('tests/user/delete-user/delete-user.feature');

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

  test('Deleting a user happy path', ({ given, when, then, and }) => {
    let userDto: CreateUser;
    let userId: Id;

    given(
      /^that my email is "(.*), my country is "(.*)", my postal code is "(.*)" and my street is "(.*)"$/,
      (email: string, country: string, postalCode: string, street: string) => {
        userDto = {
          email,
          country,
          postalCode,
          street,
        };
      },
    );

    and('my user is created', async () => {
      const res = await httpServer
        .post('/v1/users')
        .send(userDto)
        .expect(201);
      userId = res.body;
    });

    when('I send a request to delete my user', async () => {
      await httpServer
        .delete(`/v1/users/${userId.id}`)
        .send(userDto)
        .expect(200);
    });

    then('I cannot see my user in a list of all users', async () => {
      const res = await httpServer.get('/v1/users').expect(200);

      expect(res.body.some((item: UserResponse) => item.id === userId.id)).toBe(
        false,
      );
    });
  });
});
