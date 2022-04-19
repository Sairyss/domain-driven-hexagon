import { Body, Controller, Get, HttpStatus } from '@nestjs/common';
import { routesV1 } from '@config/app.routes';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Result } from 'oxide.ts/dist';
import { FindUsersQuery } from './find-users.query';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserResponse } from '../../dtos/user.response.dto';
import { FindUsersRequest } from './find-users.request.dto';

@Controller(routesV1.version)
export class FindUsersHttpController {
  constructor(private readonly queryBys: QueryBus) {}

  @Get(routesV1.user.root)
  @ApiOperation({ summary: 'Find users' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponse,
  })
  async findUsers(@Body() request: FindUsersRequest): Promise<UserResponse[]> {
    const query = new FindUsersQuery(request);
    const result: Result<UserEntity[], Error> = await this.queryBys.execute(
      query,
    );

    /* Returning Response classes which are responsible
       for whitelisting data that is sent to the user */
    return result.unwrap().map(user => new UserResponse(user));
  }
}
