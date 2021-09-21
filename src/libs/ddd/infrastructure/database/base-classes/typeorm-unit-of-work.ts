import { Logger } from '@nestjs/common';
import { UnitOfWorkPort } from '@src/libs/ddd/domain/ports/unit-of-work.port';
import { EntityTarget, getConnection, QueryRunner, Repository } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';

export class TypeormUnitOfWork implements UnitOfWorkPort {
  private queryRunners: Map<string, QueryRunner> = new Map();

  /**
   * Creates a connection pool with a specified ID.
   */
  init(correlationId: string): void {
    if (!correlationId) {
      throw new Error('Correlation ID must be provided');
    }
    const queryRunner = getConnection().createQueryRunner();
    this.queryRunners.set(correlationId, queryRunner);
  }

  getQueryRunner(correlationId: string): QueryRunner {
    const queryRunner = this.queryRunners.get(correlationId);
    if (!queryRunner) {
      throw new Error(
        'Query runner not found. UnitOfWork must be initiated first. Use "UnitOfWork.init()" method.',
      );
    }
    return queryRunner;
  }

  getOrmRepository<Entity>(
    entity: EntityTarget<Entity>,
    correlationId: string,
  ): Repository<Entity> {
    const queryRunner = this.getQueryRunner(correlationId);
    return queryRunner.manager.getRepository(entity);
  }

  /**
   * Execute a UnitOfWork.
   * Database operations wrapped in a UnitOfWork will execute in a single
   * transactional operation, so everything gets saved or nothing.
   */
  async execute<T>(
    correlationId: string,
    callback: () => Promise<T>,
    options?: { isolationLevel: IsolationLevel },
  ): Promise<T> {
    const logger = new Logger(`${this.constructor.name}:${correlationId}`);
    logger.debug(`[Starting transaction]`);
    const queryRunner = this.getQueryRunner(correlationId);
    await queryRunner.startTransaction(options?.isolationLevel);
    let result: T;
    try {
      result = await callback();
    } catch (error) {
      try {
        await queryRunner.rollbackTransaction();
      } finally {
        await this.finish(correlationId);
      }
      logger.debug(`[Transaction rolled back] ${(error as Error).message}`);
      throw error;
    }
    try {
      await queryRunner.commitTransaction();
    } finally {
      await this.finish(correlationId);
    }

    logger.debug(`[Transaction committed]`);

    return result;
  }

  private async finish(correlationId: string): Promise<void> {
    const queryRunner = this.getQueryRunner(correlationId);
    try {
      await queryRunner.release();
    } finally {
      this.queryRunners.delete(correlationId);
    }
  }
}
