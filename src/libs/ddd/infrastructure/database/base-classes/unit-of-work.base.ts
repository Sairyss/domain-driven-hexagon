import { Logger } from '@nestjs/common';
import { EntityTarget, getConnection, QueryRunner, Repository } from 'typeorm';

export abstract class UnitOfWork {
  private static queryRunner: QueryRunner;

  static init(): void {
    if (!this.queryRunner) {
      this.queryRunner = getConnection().createQueryRunner();
    }
  }

  static getQueryRunner(): QueryRunner {
    this.validate();
    return this.queryRunner;
  }

  static getOrmRepository<Entity>(
    entity: EntityTarget<Entity>,
  ): Repository<Entity> {
    this.validate();
    return this.queryRunner.manager.getRepository(entity);
  }

  /**
   * Execute a UnitOfWork.
   * Database operations wrapped in a UnitOfWork will execute in a single
   * transactional operation, so everything gets saved or nothing.
   * Make sure to generate and inject correct repositories for this to work.
   */
  static async execute<T>(callback: () => Promise<T>): Promise<T> {
    this.validate();
    const logger = new Logger(this.name);
    logger.debug('Starting transaction');
    await this.queryRunner.startTransaction();
    let result: T;
    try {
      result = await callback();
    } catch (error) {
      await this.queryRunner.rollbackTransaction();
      logger.debug(`Error: ${error.message}`);
      logger.debug('Transaction rolled back');
      throw error;
    }

    await this.queryRunner.commitTransaction();

    logger.debug('Transaction committed');

    return result;
  }

  private static validate(): void {
    if (!this.queryRunner) {
      throw new Error(
        'UnitOfWork must be initiated. Use "UnitOfWork.init()" method first.',
      );
    }
  }
}
