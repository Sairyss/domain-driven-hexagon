import { Body, Controller, Get } from '@nestjs/common';
import { routes } from '@config/app.routes';
import { UserHttpResponse } from '@modules/user/dtos/user.response.dto';
import { UserRepository } from '@modules/user/database/user.repository';
import { FindUsersQuery } from './find-users.query';
import { FindUsersHttpRequest } from './find-users.request.dto';

@Controller()
export class FindUsersHttpController {
  constructor(private readonly userRepo: UserRepository) {}

  /* Since this is a simple query with no additional business
     logic involved, it bypasses application's core completely 
     and retrieves users directly from a repository.
   */
  @Get(routes.user.root)
  async findUsers(
    @Body() request: FindUsersHttpRequest,
  ): Promise<UserHttpResponse[]> {
    const query = new FindUsersQuery(request);
    const users = await this.userRepo.findUsers(query);

    /* Returning Response classes which are responsible
       for whitelisting data that is sent to the user */
    return users.map(user => new UserHttpResponse(user));
  }
}
