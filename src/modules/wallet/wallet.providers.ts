import { Provider } from '@nestjs/common';
import {UnitOfWorkPort} from "@libs/ddd/domain/ports/unit-of-work.port";
import { CreateWalletWhenUserIsCreatedDomainEventHandler } from './application/event-handlers/create-wallet-when-user-is-created.domain-event-handler';

export const createWalletWhenUserIsCreatedProvider: Provider = {
  provide: CreateWalletWhenUserIsCreatedDomainEventHandler,
  useFactory: (
    unitOfWork: UnitOfWorkPort,
  ): CreateWalletWhenUserIsCreatedDomainEventHandler => {
    const eventHandler = new CreateWalletWhenUserIsCreatedDomainEventHandler(
      unitOfWork,
    );
    eventHandler.listen();
    return eventHandler;
  },
  inject: ["UnitOfWorkPort"],
};
