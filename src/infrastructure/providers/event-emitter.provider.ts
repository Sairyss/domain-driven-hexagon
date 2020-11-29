import { Provider } from '@nestjs/common';
import { EventEmitterAdapter } from '../adapters/event-emitter.adapter';

export const eventEmitterSymbol = Symbol('eventEmitter');

export const eventEmitterProvider: Provider = {
  provide: eventEmitterSymbol,
  useClass: EventEmitterAdapter,
};
