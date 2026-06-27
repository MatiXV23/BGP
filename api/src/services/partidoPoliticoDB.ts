import { type MySQLPromisePool } from "@fastify/mysql";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { BaseDBRepository } from "./baseRepository.js";
import type { PartidoPolitico, PartidoPoliticoPost } from "../models/partidoPoliticoModel.js";
import { PC_NotFound, PC_BadRequest, PC_InternalServerError } from "../errors/errors.js";

export class PartidoPoliticoDB extends BaseDBRepository<PartidoPolitico> {
  constructor(pool: MySQLPromisePool) {
    super(pool);
  }

  async getAll(): Promise<PartidoPolitico[]> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        "SELECT id_partido, nombre, direccion_sede FROM partido_politico"
      );
      return rows as PartidoPolitico[];
    } catch {
      throw new PC_InternalServerError();
    }
  }

  async getById(id: number): Promise<PartidoPolitico> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        "SELECT id_partido, nombre, direccion_sede FROM partido_politico WHERE id_partido = ?",
        [id]
      );
      if (rows.length === 0)
        throw new PC_NotFound(`Partido político con id (${id}) no encontrado`);
      return rows[0] as PartidoPolitico;
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }

  async create(data: PartidoPoliticoPost): Promise<PartidoPolitico> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        "INSERT INTO partido_politico (nombre, direccion_sede) VALUES (?, ?)",
        [data.nombre, data.direccion_sede ?? null]
      );
      return await this.getById(result.insertId);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_DUP_ENTRY")
        throw new PC_BadRequest("Ya existe un partido político con ese nombre");
      throw new PC_InternalServerError();
    }
  }

  async update(id: number, data: Partial<PartidoPolitico>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.nombre         !== undefined) { fields.push("nombre = ?");         values.push(data.nombre); }
    if (data.direccion_sede !== undefined) { fields.push("direccion_sede = ?"); values.push(data.direccion_sede); }

    if (fields.length === 0) return;
    values.push(id);

    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        `UPDATE partido_politico SET ${fields.join(", ")} WHERE id_partido = ?`,
        values
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Partido político con id (${id}) no encontrado`);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_DUP_ENTRY")
        throw new PC_BadRequest("Ya existe un partido político con ese nombre");
      throw new PC_InternalServerError();
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        "DELETE FROM partido_politico WHERE id_partido = ?",
        [id]
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Partido político con id (${id}) no encontrado`);
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }
}
