import { type MySQLPromisePool } from "@fastify/mysql";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { BaseDBRepository } from "./baseRepository.js";
import type { Comisaria, ComisariaPost } from "../models/comisariaModel.js";
import { PC_NotFound, PC_BadRequest, PC_InternalServerError } from "../errors/errors.js";

export class ComisariaDB extends BaseDBRepository<Comisaria> {
  constructor(pool: MySQLPromisePool) {
    super(pool);
  }

  async getAll(): Promise<Comisaria[]> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        "SELECT id_comisaria, nombre, id_departamento FROM comisaria"
      );
      return rows as Comisaria[];
    } catch {
      throw new PC_InternalServerError();
    }
  }

  async getById(id: number): Promise<Comisaria> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        "SELECT id_comisaria, nombre, id_departamento FROM comisaria WHERE id_comisaria = ?",
        [id]
      );
      if (rows.length === 0)
        throw new PC_NotFound(`Comisaría con id (${id}) no encontrada`);
      return rows[0] as Comisaria;
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }

  async create(data: ComisariaPost): Promise<Comisaria> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        "INSERT INTO comisaria (nombre, id_departamento) VALUES (?, ?)",
        [data.nombre, data.id_departamento]
      );
      return await this.getById(result.insertId);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_NO_REFERENCED_ROW_2")
        throw new PC_BadRequest("El departamento indicado no existe");
      throw new PC_InternalServerError();
    }
  }

  async update(id: number, data: Partial<Comisaria>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.nombre          !== undefined) { fields.push("nombre = ?");          values.push(data.nombre); }
    if (data.id_departamento !== undefined) { fields.push("id_departamento = ?"); values.push(data.id_departamento); }

    if (fields.length === 0) return;
    values.push(id);

    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        `UPDATE comisaria SET ${fields.join(", ")} WHERE id_comisaria = ?`,
        values
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Comisaría con id (${id}) no encontrada`);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_NO_REFERENCED_ROW_2")
        throw new PC_BadRequest("El departamento indicado no existe");
      throw new PC_InternalServerError();
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        "DELETE FROM comisaria WHERE id_comisaria = ?",
        [id]
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Comisaría con id (${id}) no encontrada`);
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }
}
