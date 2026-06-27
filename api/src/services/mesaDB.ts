import { type MySQLPromisePool } from "@fastify/mysql";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { BaseDBRepository } from "./baseRepository.js";
import type { Mesa, MesaPost } from "../models/mesaModel.js";
import { PC_NotFound, PC_BadRequest, PC_InternalServerError } from "../errors/errors.js";

export class MesaDB extends BaseDBRepository<Mesa> {
  constructor(pool: MySQLPromisePool) {
    super(pool);
  }

  async getAll(): Promise<Mesa[]> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        `SELECT id_mesa, id_circuito, id_eleccion,
                ci_presidente, ci_secretario, ci_vocal
         FROM mesa`
      );
      return rows as Mesa[];
    } catch {
      throw new PC_InternalServerError();
    }
  }

  async getById(id: number): Promise<Mesa> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        `SELECT id_mesa, id_circuito, id_eleccion,
                ci_presidente, ci_secretario, ci_vocal
         FROM mesa WHERE id_mesa = ?`,
        [id]
      );
      if (rows.length === 0)
        throw new PC_NotFound(`Mesa con id (${id}) no encontrada`);
      return rows[0] as Mesa;
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }

  async create(data: MesaPost): Promise<Mesa> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        `INSERT INTO mesa (id_circuito, id_eleccion, ci_presidente, ci_secretario, ci_vocal)
         VALUES (?, ?, ?, ?, ?)`,
        [data.id_circuito, data.id_eleccion, data.ci_presidente, data.ci_secretario, data.ci_vocal]
      );
      return await this.getById(result.insertId);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_DUP_ENTRY")
        throw new PC_BadRequest("Ya existe una mesa para ese circuito y elección");
      if (err?.code === "ER_NO_REFERENCED_ROW_2")
        throw new PC_BadRequest("El circuito, la elección o algún miembro de mesa indicado no existe");
      throw new PC_InternalServerError();
    }
  }

  async update(id: number, data: Partial<Mesa>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.id_circuito    !== undefined) { fields.push("id_circuito = ?");    values.push(data.id_circuito); }
    if (data.id_eleccion    !== undefined) { fields.push("id_eleccion = ?");    values.push(data.id_eleccion); }
    if (data.ci_presidente  !== undefined) { fields.push("ci_presidente = ?");  values.push(data.ci_presidente); }
    if (data.ci_secretario  !== undefined) { fields.push("ci_secretario = ?");  values.push(data.ci_secretario); }
    if (data.ci_vocal       !== undefined) { fields.push("ci_vocal = ?");       values.push(data.ci_vocal); }

    if (fields.length === 0) return;
    values.push(id);

    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        `UPDATE mesa SET ${fields.join(", ")} WHERE id_mesa = ?`,
        values
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Mesa con id (${id}) no encontrada`);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_DUP_ENTRY")
        throw new PC_BadRequest("Ya existe una mesa para ese circuito y elección");
      if (err?.code === "ER_NO_REFERENCED_ROW_2")
        throw new PC_BadRequest("El circuito, la elección o algún miembro de mesa indicado no existe");
      throw new PC_InternalServerError();
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        "DELETE FROM mesa WHERE id_mesa = ?",
        [id]
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Mesa con id (${id}) no encontrada`);
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }
}
