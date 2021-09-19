import { Test, TestingModuleBuilder, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

export class TestServer {
  constructor(
    public readonly serverApplication: NestExpressApplication,
    public readonly testingModule: TestingModule,
  ) {}

  public static async new(
    testingModuleBuilder: TestingModuleBuilder,
  ): Promise<TestServer> {
    const testingModule: TestingModule = await testingModuleBuilder.compile();

    const serverApplication: NestExpressApplication = testingModule.createNestApplication();
    await serverApplication.init();

    return new TestServer(serverApplication, testingModule);
  }
}

export async function generateTestingApplication(): Promise<{
  testServer: TestServer;
  // api: ApiClient;
}> {
  const testServer = await TestServer.new(
    Test.createTestingModule({
      imports: [AppModule],
    }),
  );

  return {
    testServer,
  };
}

let testServer: TestServer;

export function getTestServer(): TestServer {
  return testServer;
}

beforeAll(
  async (): Promise<void> => {
    ({ testServer } = await generateTestingApplication());
  },
);
