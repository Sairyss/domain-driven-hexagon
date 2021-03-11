import { Body, Controller, Get } from '@nestjs/common';
import { routes } from '@config/app.routes';
import { UserResponse } from '@modules/user/dtos/user.response.dto';
import { UserRepository } from '@modules/user/database/user.repository';
import { FindUserByEmailRequest } from './find-user-by-email.request.dto';

@Controller()
export class FindUserByEmailHttpController {
  constructor(private readonly userRepo: UserRepository) {}

  /* Since this is a simple query with no additional business
     logic involved, it bypasses application's core completely 
     and retrieves user directly from repository.
   */
  @Get(routes.user.root)
  async findByEmail(
    @Body() { email }: FindUserByEmailRequest,
  ): Promise<UserResponse> {
    const user = await this.userRepo.findOneByEmailOrThrow(email);

    return new UserResponse(user);
  }
}
