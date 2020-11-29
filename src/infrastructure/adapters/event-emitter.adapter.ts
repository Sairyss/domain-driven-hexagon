import { NestEventEmitter } from 'nest-event';
import { EventEmitterPort } from '../../application/ports/event-emitter.port';

export class EventEmitterAdapter extends NestEventEmitter
  implements EventEmitterPort {}
