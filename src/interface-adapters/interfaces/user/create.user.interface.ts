/*  Creating interfaces like this may be useful if you need to share types with
    a front end web/mobile application, microservices, or other TypeScript APIs.
    You can share interfaces as a git submodule, a npm package, a library or in a monorepo, etc.
*/
export interface CreateUser {
  readonly email: string;
  readonly country: string;
  readonly postalCode: string;
  readonly street: string;
}
