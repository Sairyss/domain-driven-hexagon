import {
  BeforeInsert,
  BeforeRemove,
  BeforeUpdate,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ID } from 'src/core/value-objects/id.value-object';
import { DomainEvents } from 'src/core/domain-events';

export abstract class TypeormEntityBase {
  constructor(props?: unknown) {
    if (props) {
      Object.assign(this, props);
    }
  }

  @PrimaryColumn({ update: false })
  id!: string;

  @CreateDateColumn({
    type: 'timestamptz',
    update: false,
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  @BeforeRemove()
  public async publishAggregateEvents(): Promise<void> {
    const aggregateId = new ID(this.id);
    await DomainEvents.publishEvents(aggregateId);
  }
}
