export interface EventEmitterPort {
  emit<T>(event: string, ...args: T[]): void;
}
