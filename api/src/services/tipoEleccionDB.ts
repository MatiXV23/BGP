import { type MySQLPromisePool } from "@fastify/mysql";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { BaseDBRepository } from "./baseRepository.js";
import type { TipoEleccion, TipoEleccionPost } from "../models/tipoEleccionModel.js";
import { PC_NotFound, PC_BadRequest, PC_InternalServerError } from "../errors/errors.js";

export class TipoEleccionDB extends BaseDBRepository<TipoEleccion> {
  constructor(pool: MySQLPromisePool) {
    super(pool);
  }

  async getAll(): Promise<TipoEleccion[]> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        "SELECT id_tipo, nombre FROM tipo_eleccion"
      );
      return rows as TipoEleccion[];
    } catch {
      throw new PC_InternalServerError();
    }
  }

  async getById(id: number): Promise<TipoEleccion> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        "SELECT id_tipo, nombre FROM tipo_eleccion WHERE id_tipo = ?",
        [id]
      );
      if (rows.length === 0)
        throw new PC_NotFound(`Tipo de elección con id (${id}) no encontrado`);
      return rows[0] as TipoEleccion;
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }

  async create(data: TipoEleccionPost): Promise<TipoEleccion> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        "INSERT INTO tipo_eleccion (nombre) VALUES (?)",
        [data.nombre]
      );
      return await this.getById(result.insertId);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_DUP_ENTRY")
        throw new PC_BadRequest("Ya existe ese tipo de elección");
      throw new PC_InternalServerError();
    }
  }

  async update(id: number, data: Partial<TipoEleccion>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.nombre !== undefined) { fields.push("nombre = ?"); values.push(data.nombre); }

    if (fields.length === 0) return;
    values.push(id);

    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        `UPDATE tipo_eleccion SET ${fields.join(", ")} WHERE id_tipo = ?`,
        values
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Tipo de elección con id (${id}) no encontrado`);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_DUP_ENTRY")
        throw new PC_BadRequest("Ya existe ese tipo de elección");
      throw new PC_InternalServerError();
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        "DELETE FROM tipo_eleccion WHERE id_tipo = ?",
        [id]
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Tipo de elección con id (${id}) no encontrado`);
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }
}
