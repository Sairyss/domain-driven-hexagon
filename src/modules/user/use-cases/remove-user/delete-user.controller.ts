import { Controller, Delete, Inject, Param } from '@nestjs/common';
import { routes } from '@config/app.routes';
import { removeUserSymbol } from '@modules/user/user.providers';
import { DeleteUserService } from './delete-user.service';

@Controller()
export class DeleteUserHttpController {
  constructor(
    @Inject(removeUserSymbol)
    private readonly service: DeleteUserService,
  ) {}

  @Delete(routes.user.delete)
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.service.delete(id);
  }
}
