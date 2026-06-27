import { type MySQLPromisePool } from "@fastify/mysql";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { BaseDBRepository } from "./baseRepository.js";
import type { Eleccion, EleccionPost } from "../models/eleccionModel.js";
import { PC_NotFound, PC_BadRequest, PC_InternalServerError } from "../errors/errors.js";

export class EleccionDB extends BaseDBRepository<Eleccion> {
  constructor(pool: MySQLPromisePool) {
    super(pool);
  }

  async getAll(): Promise<Eleccion[]> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        `SELECT id_eleccion, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha, id_tipo, descripcion
         FROM eleccion`
      );
      return rows as Eleccion[];
    } catch {
      throw new PC_InternalServerError();
    }
  }

  async getById(id: number): Promise<Eleccion> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        `SELECT id_eleccion, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha, id_tipo, descripcion
         FROM eleccion WHERE id_eleccion = ?`,
        [id]
      );
      if (rows.length === 0)
        throw new PC_NotFound(`Elección con id (${id}) no encontrada`);
      return rows[0] as Eleccion;
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }

  async create(data: EleccionPost): Promise<Eleccion> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        "INSERT INTO eleccion (fecha, id_tipo, descripcion) VALUES (?, ?, ?)",
        [data.fecha, data.id_tipo, data.descripcion ?? null]
      );
      return await this.getById(result.insertId);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_NO_REFERENCED_ROW_2")
        throw new PC_BadRequest("El tipo de elección indicado no existe");
      throw new PC_InternalServerError();
    }
  }

  async update(id: number, data: Partial<Eleccion>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.fecha       !== undefined) { fields.push("fecha = ?");       values.push(data.fecha); }
    if (data.id_tipo     !== undefined) { fields.push("id_tipo = ?");     values.push(data.id_tipo); }
    if (data.descripcion !== undefined) { fields.push("descripcion = ?"); values.push(data.descripcion); }

    if (fields.length === 0) return;
    values.push(id);

    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        `UPDATE eleccion SET ${fields.join(", ")} WHERE id_eleccion = ?`,
        values
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Elección con id (${id}) no encontrada`);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_NO_REFERENCED_ROW_2")
        throw new PC_BadRequest("El tipo de elección indicado no existe");
      throw new PC_InternalServerError();
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        "DELETE FROM eleccion WHERE id_eleccion = ?",
        [id]
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Elección con id (${id}) no encontrada`);
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }
}
