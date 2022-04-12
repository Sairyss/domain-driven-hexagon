import { UnitOfWorkPort } from '@src/libs/ddd/domain/ports/unit-of-work.port';
import { EntityTarget, getConnection, QueryRunner, Repository } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';
import { Logger } from 'src/libs/ddd/domain/ports/logger.port';
import { Err, Result } from 'oxide.ts/dist';

/**
 * Keep in mind that this is a naive implementation
 * of a Unit of Work as it only wraps execution into
 * a transaction. Proper Unit of Work implementation
 * requires storing all changes in memory first and
 * then execute a transaction as a singe database call.
 * Mikro-orm (https://www.npmjs.com/package/mikro-orm)
 * is a nice ORM for nodejs that can be used instead
 * of typeorm to have a proper Unit of Work pattern.
 * Read more about mikro-orm unit of work:
 * https://mikro-orm.io/docs/unit-of-work/.
 */
export class TypeormUnitOfWork implements UnitOfWorkPort {
  constructor(private readonly logger: Logger) {}

  private queryRunners: Map<string, QueryRunner> = new Map();

  getQueryRunner(correlationId: string): QueryRunner {
    const queryRunner = this.queryRunners.get(correlationId);
    if (!queryRunner) {
      throw new Error(
        'Query runner not found. Incorrect correlationId or transaction is not started. To start a transaction wrap operations in a "execute" method.',
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
   * Database operations wrapped in a `execute` method will run
   * in a single transactional operation, so everything gets
   * saved (including changes done by Domain Events) or nothing at all.
   */
  async execute<T>(
    correlationId: string,
    callback: () => Promise<T>,
    options?: { isolationLevel: IsolationLevel },
  ): Promise<T> {
    if (!correlationId) {
      throw new Error('Correlation ID must be provided');
    }
    this.logger.setContext(`${this.constructor.name}:${correlationId}`);
    const queryRunner = getConnection().createQueryRunner();
    this.queryRunners.set(correlationId, queryRunner);
    this.logger.debug(`[Starting transaction]`);
    await queryRunner.startTransaction(options?.isolationLevel);
    // const queryRunner = this.getQueryRunner(correlationId);
    let result: T | Result<T, Error>;
    try {
      result = await callback();
      if (((result as unknown) as Result<T, Error>)?.isErr()) {
        await this.rollbackTransaction<T>(
          correlationId,
          ((result as unknown) as Err<Error, T>).unwrapErr(),
        );
        return result;
      }
    } catch (error) {
      await this.rollbackTransaction<T>(correlationId, error as Error);
      throw error;
    }
    try {
      await queryRunner.commitTransaction();
    } finally {
      await this.finish(correlationId);
    }

    this.logger.debug(`[Transaction committed]`);

    return result;
  }

  private async rollbackTransaction<T>(correlationId: string, error: Error) {
    const queryRunner = this.getQueryRunner(correlationId);
    try {
      await queryRunner.rollbackTransaction();
      this.logger.debug(
        `[Transaction rolled back] ${(error as Error).message}`,
      );
    } finally {
      await this.finish(correlationId);
    }
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
