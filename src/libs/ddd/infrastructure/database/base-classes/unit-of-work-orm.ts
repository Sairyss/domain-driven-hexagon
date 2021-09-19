import { Logger } from '@nestjs/common';
import { EntityTarget, getConnection, QueryRunner, Repository } from 'typeorm';

export class UnitOfWorkOrm {
  private static queryRunners: Map<string, QueryRunner> = new Map();

  /**
   * Creates a connection pool with a specified ID.
   */
  static init(correlationId: string): void {
    if (!correlationId) {
      throw new Error('Correlation ID must be provided');
    }
    const queryRunner = getConnection().createQueryRunner();
    this.queryRunners.set(correlationId, queryRunner);
  }

  static getQueryRunner(correlationId: string): QueryRunner {
    const queryRunner = this.queryRunners.get(correlationId);
    if (!queryRunner) {
      throw new Error(
        'Query runner not found. UnitOfWork must be initiated first. Use "UnitOfWork.init()" method.',
      );
    }
    return queryRunner;
  }

  static getOrmRepository<Entity>(
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
   * Make sure to generate and inject correct repositories for this to work.
   */
  static async execute<T>(
    correlationId: string,
    callback: () => Promise<T>,
  ): Promise<T> {
    const logger = new Logger(`${this.name}:${correlationId}`);
    logger.debug(`[Starting transaction]`);
    const queryRunner = this.getQueryRunner(correlationId);
    await queryRunner.startTransaction('SERIALIZABLE');
    let result: T;
    try {
      result = await callback();
    } catch (error) {
      try {
        await queryRunner.rollbackTransaction();
      } finally {
        await this.finish(correlationId);
      }
      logger.debug(`[Transaction rolled back]`);
      logger.debug(`[Error]: ${error.message}`);
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

  static async finish(correlationId: string): Promise<void> {
    const queryRunner = this.getQueryRunner(correlationId);
    try {
      await queryRunner.release();
    } finally {
      this.queryRunners.delete(correlationId);
    }
  }
}
