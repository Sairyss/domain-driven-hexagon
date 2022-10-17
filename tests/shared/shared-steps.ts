import { ApiErrorResponse } from '@src/libs/api/api-error.response';
import { TestContext } from '@tests/test-utils/TestContext';
import { CreateUserTestContext } from '@tests/user/user-shared-steps';
import { DefineStepFunction } from 'jest-cucumber';

/**
 * Test steps that can be shared between all tests
 */

export const iReceiveAnErrorWithStatusCode = (
  then: DefineStepFunction,
  ctx: TestContext<CreateUserTestContext>,
): void => {
  then(
    /^I receive an error "(.*)" with status code (\d+)$/,
    async (errorMessage: string, statusCode: string) => {
      const apiError = ctx.latestResponse as ApiErrorResponse;
      expect(apiError.statusCode).toBe(parseInt(statusCode));
      expect(apiError.error).toBe(errorMessage);
    },
  );
};
