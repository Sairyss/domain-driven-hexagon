export interface UnitOfWorkPort {
  init(correlationId: string): void;
  execute<T>(correlationId: string, callback: () => Promise<T>): Promise<T>;
}
