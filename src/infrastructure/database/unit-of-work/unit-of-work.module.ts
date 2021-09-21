import { Global, Module } from '@nestjs/common';
import { UnitOfWork } from './unit-of-work';

const unitOfWorkSingleton = new UnitOfWork();

const unitOfWorkSingletonProvider = {
  provide: UnitOfWork,
  useFactory: () => unitOfWorkSingleton,
};

@Global()
@Module({
  imports: [],
  providers: [unitOfWorkSingletonProvider],
  exports: [UnitOfWork],
})
export class UnitOfWorkModule {}
