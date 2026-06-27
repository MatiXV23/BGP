import { type MySQLPromisePool } from "@fastify/mysql";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { BaseDBRepository } from "./baseRepository.js";
import type { Establecimiento, EstablecimientoPost } from "../models/establecimientoModel.js";
import { PC_NotFound, PC_BadRequest, PC_InternalServerError } from "../errors/errors.js";

export class EstablecimientoDB extends BaseDBRepository<Establecimiento> {
  constructor(pool: MySQLPromisePool) {
    super(pool);
  }

  async getAll(): Promise<Establecimiento[]> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        "SELECT id_establecimiento, nombre, tipo, id_zona FROM establecimiento"
      );
      return rows as Establecimiento[];
    } catch {
      throw new PC_InternalServerError();
    }
  }

  async getById(id: number): Promise<Establecimiento> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        "SELECT id_establecimiento, nombre, tipo, id_zona FROM establecimiento WHERE id_establecimiento = ?",
        [id]
      );
      if (rows.length === 0)
        throw new PC_NotFound(`Establecimiento con id (${id}) no encontrado`);
      return rows[0] as Establecimiento;
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }

  async create(data: EstablecimientoPost): Promise<Establecimiento> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        "INSERT INTO establecimiento (nombre, tipo, id_zona) VALUES (?, ?, ?)",
        [data.nombre, data.tipo, data.id_zona]
      );
      return await this.getById(result.insertId);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_NO_REFERENCED_ROW_2")
        throw new PC_BadRequest("La zona indicada no existe");
      throw new PC_InternalServerError();
    }
  }

  async update(id: number, data: Partial<Establecimiento>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.nombre  !== undefined) { fields.push("nombre = ?");  values.push(data.nombre); }
    if (data.tipo    !== undefined) { fields.push("tipo = ?");    values.push(data.tipo); }
    if (data.id_zona !== undefined) { fields.push("id_zona = ?"); values.push(data.id_zona); }

    if (fields.length === 0) return;
    values.push(id);

    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        `UPDATE establecimiento SET ${fields.join(", ")} WHERE id_establecimiento = ?`,
        values
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Establecimiento con id (${id}) no encontrado`);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_NO_REFERENCED_ROW_2")
        throw new PC_BadRequest("La zona indicada no existe");
      throw new PC_InternalServerError();
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        "DELETE FROM establecimiento WHERE id_establecimiento = ?",
        [id]
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Establecimiento con id (${id}) no encontrado`);
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }
}
