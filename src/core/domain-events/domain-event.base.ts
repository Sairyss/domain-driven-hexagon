export abstract class DomainEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly dateOccurred: number,
  ) {}
}
