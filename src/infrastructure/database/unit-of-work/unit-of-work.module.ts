import {FactoryProvider, Global, Logger, Module} from '@nestjs/common';
import { UnitOfWork } from './unit-of-work';

const unitOfWorkSingleton = new UnitOfWork(new Logger());

const unitOfWorkSingletonProvider : FactoryProvider = {
  provide: "UnitOfWorkPort",
  useFactory: () => unitOfWorkSingleton,
};

@Global()
@Module({
  imports: [],
  providers: [unitOfWorkSingletonProvider],
  exports: ["UnitOfWorkPort"],
})
export class UnitOfWorkModule {}
