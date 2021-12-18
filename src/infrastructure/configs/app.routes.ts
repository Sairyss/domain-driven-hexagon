/**
 * Application routes with its version
 * https://github.com/Sairyss/backend-best-practices#api-versioning
 */
const usersRoot = '/users';
export const routesV1 = {
  version: 'v1',
  user: {
    root: usersRoot,
    delete: `${usersRoot}/:id`,
  },
};
