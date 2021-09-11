const usersRoot = '/users';

export const routes = {
  user: {
    root: usersRoot,
    delete: `${usersRoot}/:id`,
  },
};
