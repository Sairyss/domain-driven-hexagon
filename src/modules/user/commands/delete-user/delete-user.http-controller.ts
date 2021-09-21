import { Controller, Delete, Inject, Param } from '@nestjs/common';
import { routesV1 } from '@config/app.routes';
import { removeUserSymbol } from '@modules/user/user.providers';
import { DeleteUserService } from './delete-user.service';
import { DeleteUserCommand } from './delete-user.command';

@Controller(routesV1.version)
export class DeleteUserHttpController {
  constructor(
    @Inject(removeUserSymbol)
    private readonly service: DeleteUserService,
  ) {}

  @Delete(routesV1.user.delete)
  async deleteUser(@Param('id') id: string): Promise<void> {
    const command = new DeleteUserCommand({ userId: id });
    await this.service.execute(command);
  }
}
