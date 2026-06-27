import { type MySQLPromisePool } from "@fastify/mysql";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { BaseDBRepository } from "./baseRepository.js";
import type { Departamento, DepartamentoPost } from "../models/departamentoModel.js";
import { PC_NotFound, PC_BadRequest, PC_InternalServerError } from "../errors/errors.js";

export class DepartamentoDB extends BaseDBRepository<Departamento> {
  constructor(pool: MySQLPromisePool) {
    super(pool);
  }

  async getAll(): Promise<Departamento[]> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        "SELECT id_departamento, nombre FROM departamento"
      );
      return rows as Departamento[];
    } catch {
      throw new PC_InternalServerError();
    }
  }

  async getById(id: number): Promise<Departamento> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        "SELECT id_departamento, nombre FROM departamento WHERE id_departamento = ?",
        [id]
      );
      if (rows.length === 0)
        throw new PC_NotFound(`Departamento con id (${id}) no encontrado`);
      return rows[0] as Departamento;
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }

  async create(data: DepartamentoPost): Promise<Departamento> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        "INSERT INTO departamento (nombre) VALUES (?)",
        [data.nombre]
      );
      return await this.getById(result.insertId);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_DUP_ENTRY")
        throw new PC_BadRequest("Ya existe un departamento con ese nombre");
      throw new PC_InternalServerError();
    }
  }

  async update(id: number, data: Partial<Departamento>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.nombre !== undefined) { fields.push("nombre = ?"); values.push(data.nombre); }

    if (fields.length === 0) return;
    values.push(id);

    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        `UPDATE departamento SET ${fields.join(", ")} WHERE id_departamento = ?`,
        values
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Departamento con id (${id}) no encontrado`);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_DUP_ENTRY")
        throw new PC_BadRequest("Ya existe un departamento con ese nombre");
      throw new PC_InternalServerError();
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        "DELETE FROM departamento WHERE id_departamento = ?",
        [id]
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Departamento con id (${id}) no encontrado`);
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }
}
