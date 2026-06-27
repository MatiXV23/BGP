import { type MySQLPromisePool } from "@fastify/mysql";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { BaseDBRepository } from "./baseRepository.js";
import type { OrganismoEstado, OrganismoEstadoPost } from "../models/organismoEstadoModel.js";
import { PC_NotFound, PC_BadRequest, PC_InternalServerError } from "../errors/errors.js";

export class OrganismoEstadoDB extends BaseDBRepository<OrganismoEstado> {
  constructor(pool: MySQLPromisePool) {
    super(pool);
  }

  async getAll(): Promise<OrganismoEstado[]> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        "SELECT id_organismo, nombre FROM organismo_estado"
      );
      return rows as OrganismoEstado[];
    } catch {
      throw new PC_InternalServerError();
    }
  }

  async getById(id: number): Promise<OrganismoEstado> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        "SELECT id_organismo, nombre FROM organismo_estado WHERE id_organismo = ?",
        [id]
      );
      if (rows.length === 0)
        throw new PC_NotFound(`Organismo con id (${id}) no encontrado`);
      return rows[0] as OrganismoEstado;
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }

  async create(data: OrganismoEstadoPost): Promise<OrganismoEstado> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        "INSERT INTO organismo_estado (nombre) VALUES (?)",
        [data.nombre]
      );
      return await this.getById(result.insertId);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_DUP_ENTRY")
        throw new PC_BadRequest("Ya existe un organismo con ese nombre");
      throw new PC_InternalServerError();
    }
  }

  async update(id: number, data: Partial<OrganismoEstado>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.nombre !== undefined) { fields.push("nombre = ?"); values.push(data.nombre); }

    if (fields.length === 0) return;
    values.push(id);

    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        `UPDATE organismo_estado SET ${fields.join(", ")} WHERE id_organismo = ?`,
        values
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Organismo con id (${id}) no encontrado`);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_DUP_ENTRY")
        throw new PC_BadRequest("Ya existe un organismo con ese nombre");
      throw new PC_InternalServerError();
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        "DELETE FROM organismo_estado WHERE id_organismo = ?",
        [id]
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Organismo con id (${id}) no encontrado`);
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }
}
