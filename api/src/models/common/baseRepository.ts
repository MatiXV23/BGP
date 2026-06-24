import { type MySQLPromisePool } from "@fastify/mysql";

export abstract class BasePgRepository<T> {
  protected pool: MySQLPromisePool;
  constructor(pool: MySQLPromisePool) {
    this.pool = pool;
  }
  abstract getAll(): Promise<T[]>;

  abstract getById(id: number): Promise<T>;

  abstract create(data: Partial<T>): Promise<T>;

  abstract update(id: number, data: Partial<T>): Promise<T>;

  abstract delete(id: number): Promise<void>;
}
