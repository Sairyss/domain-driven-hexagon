import { Logger } from '@nestjs/common';
import { EntityTarget, getConnection, QueryRunner, Repository } from 'typeorm';
import { nanoid } from 'nanoid';

export class UnitOfWorkOrm {
  private static queryRunners: Map<string, QueryRunner> = new Map();

  /**
   * Create a connection pool and get its ID.
   * ID is used for correlation purposes (to use a correct query runner, correlate logs etc)
   */
  static init(): string {
    const queryRunner = getConnection().createQueryRunner();
    const correlationId = nanoid(8);
    this.queryRunners.set(correlationId, queryRunner);
    return correlationId;
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
    await queryRunner.startTransaction();
    let result: T;
    try {
      result = await callback();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.debug(`[Error]: ${error.message}`);
      logger.debug(`[Transaction rolled back]`);
      await this.finish(correlationId);
      throw error;
    }

    await queryRunner.commitTransaction();
    await this.finish(correlationId);

    logger.debug(`[Transaction committed]`);

    return result;
  }

  static async finish(correlationId: string): Promise<void> {
    const queryRunner = this.getQueryRunner(correlationId);
    queryRunner.release();
    this.queryRunners.delete(correlationId);
  }
}
