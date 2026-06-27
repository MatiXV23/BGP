import { type MySQLPromisePool } from "@fastify/mysql";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { BaseDBRepository } from "./baseRepository.js";
import type { MiembroMesa, MiembroMesaPost } from "../models/miembroMesaModel.js";
import { PC_NotFound, PC_BadRequest, PC_InternalServerError } from "../errors/errors.js";

export class MiembroMesaDB extends BaseDBRepository<MiembroMesa> {
  constructor(pool: MySQLPromisePool) {
    super(pool);
  }

  async getAll(): Promise<MiembroMesa[]> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        "SELECT cedula_identidad, id_organismo FROM miembro_mesa"
      );
      return rows as MiembroMesa[];
    } catch {
      throw new PC_InternalServerError();
    }
  }

  async getById(cedula: string): Promise<MiembroMesa> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        "SELECT cedula_identidad, id_organismo FROM miembro_mesa WHERE cedula_identidad = ?",
        [cedula]
      );
      if (rows.length === 0)
        throw new PC_NotFound(`Miembro de mesa con cédula (${cedula}) no encontrado`);
      return rows[0] as MiembroMesa;
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }

  async create(data: MiembroMesaPost): Promise<MiembroMesa> {
    try {
      await this.pool.query<ResultSetHeader>(
        "INSERT INTO miembro_mesa (cedula_identidad, id_organismo) VALUES (?, ?)",
        [data.cedula_identidad, data.id_organismo]
      );
      return await this.getById(data.cedula_identidad);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_DUP_ENTRY")
        throw new PC_BadRequest("Ese miembro de mesa ya está registrado");
      if (err?.code === "ER_NO_REFERENCED_ROW_2")
        throw new PC_BadRequest("La cédula o el organismo indicado no existe");
      throw new PC_InternalServerError();
    }
  }

  async update(cedula: string, data: Partial<MiembroMesa>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.id_organismo !== undefined) { fields.push("id_organismo = ?"); values.push(data.id_organismo); }

    if (fields.length === 0) return;
    values.push(cedula);

    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        `UPDATE miembro_mesa SET ${fields.join(", ")} WHERE cedula_identidad = ?`,
        values
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Miembro de mesa con cédula (${cedula}) no encontrado`);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_NO_REFERENCED_ROW_2")
        throw new PC_BadRequest("El organismo indicado no existe");
      throw new PC_InternalServerError();
    }
  }

  async delete(cedula: string): Promise<void> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        "DELETE FROM miembro_mesa WHERE cedula_identidad = ?",
        [cedula]
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Miembro de mesa con cédula (${cedula}) no encontrado`);
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }
}
