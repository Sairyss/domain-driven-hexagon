const usersRoot = '/user';

export const routes = {
  user: {
    root: usersRoot,
    delete: `${usersRoot}/:id`,
  },
};
