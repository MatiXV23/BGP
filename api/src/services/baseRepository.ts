import { type MySQLPromisePool } from "@fastify/mysql";

export abstract class BaseDBRepository<T> {
  protected pool: MySQLPromisePool;

  constructor(pool: MySQLPromisePool) {
    this.pool = pool;
  }

  abstract getAll(): Promise<T[]>;
  abstract getById(id: number | string): Promise<T>;
  abstract create(data: Partial<T>): Promise<T>;
  abstract update(id: number | string, data: Partial<T>): Promise<void>;
  abstract delete(id: number | string): Promise<void>;
}
