import { type MySQLPromisePool } from "@fastify/mysql";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { BaseDBRepository } from "./baseRepository.js";
import type { AgentePolicial, AgentePolicialPost } from "../models/agentePolicialModel.js";
import { PC_NotFound, PC_BadRequest, PC_InternalServerError } from "../errors/errors.js";

export class AgentePolicialDB extends BaseDBRepository<AgentePolicial> {
  constructor(pool: MySQLPromisePool) {
    super(pool);
  }

  async getAll(): Promise<AgentePolicial[]> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        "SELECT cedula_identidad, id_comisaria FROM agente_policial"
      );
      return rows as AgentePolicial[];
    } catch {
      throw new PC_InternalServerError();
    }
  }

  async getById(cedula: string): Promise<AgentePolicial> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        "SELECT cedula_identidad, id_comisaria FROM agente_policial WHERE cedula_identidad = ?",
        [cedula]
      );
      if (rows.length === 0)
        throw new PC_NotFound(`Agente policial con cédula (${cedula}) no encontrado`);
      return rows[0] as AgentePolicial;
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }

  async create(data: AgentePolicialPost): Promise<AgentePolicial> {
    try {
      await this.pool.query<ResultSetHeader>(
        "INSERT INTO agente_policial (cedula_identidad, id_comisaria) VALUES (?, ?)",
        [data.cedula_identidad, data.id_comisaria]
      );
      return await this.getById(data.cedula_identidad);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_DUP_ENTRY")
        throw new PC_BadRequest("Ese agente policial ya está registrado");
      if (err?.code === "ER_NO_REFERENCED_ROW_2")
        throw new PC_BadRequest("La comisaría indicada no existe");
      throw new PC_InternalServerError();
    }
  }

  async update(cedula: string, data: Partial<AgentePolicial>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.id_comisaria !== undefined) { fields.push("id_comisaria = ?"); values.push(data.id_comisaria); }

    if (fields.length === 0) return;
    values.push(cedula);

    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        `UPDATE agente_policial SET ${fields.join(", ")} WHERE cedula_identidad = ?`,
        values
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Agente policial con cédula (${cedula}) no encontrado`);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_NO_REFERENCED_ROW_2")
        throw new PC_BadRequest("La comisaría indicada no existe");
      throw new PC_InternalServerError();
    }
  }

  async delete(cedula: string): Promise<void> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        "DELETE FROM agente_policial WHERE cedula_identidad = ?",
        [cedula]
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Agente policial con cédula (${cedula}) no encontrado`);
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }
}
