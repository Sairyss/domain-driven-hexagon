import { NestEventEmitter } from 'nest-event';
import { EventEmitterPort } from 'src/core/ports/event-emitter.port';

export class EventEmitterAdapter extends NestEventEmitter
  implements EventEmitterPort {}
