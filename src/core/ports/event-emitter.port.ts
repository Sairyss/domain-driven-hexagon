import { Events } from '../events/events';

export interface EventEmitterPort {
  emit<T>(event: Events, ...args: T[]): void;
}
