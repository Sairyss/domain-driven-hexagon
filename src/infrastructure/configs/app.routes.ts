const usersRoot = '/users';

export const routes = {
  user: {
    root: usersRoot,
    findByEmail: `${usersRoot}/:email`,
    delete: `${usersRoot}/:id`,
  },
};
