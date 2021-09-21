const usersRoot = '/users';

export const routesV1 = {
  version: 'v1',
  user: {
    root: usersRoot,
    delete: `${usersRoot}/:id`,
  },
};
