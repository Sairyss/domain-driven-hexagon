import { defineFeature, loadFeature } from 'jest-cucumber';
import * as request from 'supertest';
import { CreateUser } from '@src/interface-adapters/interfaces/user/create.user.interface';
import { getTestServer, TestServer } from '../../jestSetupAfterEnv';
import { CreateUserService } from '@src/modules/user/commands/create-user/create-user.service';
import { CreateUserCommand } from '@src/modules/user/commands/create-user/create-user.command';
import { ID } from '@src/libs/ddd/domain/value-objects/id.value-object';

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
    let userId: ID;

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
      await testServer.testingModule
        .get<CreateUserService>(CreateUserService)
        .execute(
          new CreateUserCommand({
            email: userDto.email,
            country: userDto.country,
            postalCode: userDto.postalCode,
            street: userDto.street,

            correlationId: 'correlation-e2e-delete-user',
          }),
        )
        .then(user => {
          userId = user.unwrap();
        });
    });

    when('I send a request to delete my user', async () => {
      await httpServer
        .delete('/v1/users/' + userId.value)
        .send(userDto)
        .expect(200);
    });

    then('I cannot see my user in a list of all users', async () => {
      const res = await httpServer.get('/v1/users').expect(200);

      expect(res.body).toHaveLength(0);
    });
  });
});
