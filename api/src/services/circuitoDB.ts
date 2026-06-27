import { type MySQLPromisePool } from "@fastify/mysql";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { BaseDBRepository } from "./baseRepository.js";
import type { Circuito, CircuitoPost } from "../models/circuitoModel.js";
import { PC_NotFound, PC_BadRequest, PC_InternalServerError } from "../errors/errors.js";

export class CircuitoDB extends BaseDBRepository<Circuito> {
  constructor(pool: MySQLPromisePool) {
    super(pool);
  }

  async getAll(): Promise<Circuito[]> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        `SELECT id_circuito, numero, id_establecimiento, id_departamento,
                localidad, barrio_zona, es_accesible
         FROM circuito`
      );
      return rows as Circuito[];
    } catch {
      throw new PC_InternalServerError();
    }
  }

  async getById(id: number): Promise<Circuito> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        `SELECT id_circuito, numero, id_establecimiento, id_departamento,
                localidad, barrio_zona, es_accesible
         FROM circuito WHERE id_circuito = ?`,
        [id]
      );
      if (rows.length === 0)
        throw new PC_NotFound(`Circuito con id (${id}) no encontrado`);
      return rows[0] as Circuito;
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }

  async create(data: CircuitoPost): Promise<Circuito> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        `INSERT INTO circuito (numero, id_establecimiento, id_departamento, localidad, barrio_zona, es_accesible)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [data.numero, data.id_establecimiento, data.id_departamento, data.localidad, data.barrio_zona ?? null, data.es_accesible]
      );
      return await this.getById(result.insertId);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_DUP_ENTRY")
        throw new PC_BadRequest("Ya existe un circuito con ese número");
      if (err?.code === "ER_NO_REFERENCED_ROW_2")
        throw new PC_BadRequest("El establecimiento o departamento indicado no existe");
      throw new PC_InternalServerError();
    }
  }

  async update(id: number, data: Partial<Circuito>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.numero             !== undefined) { fields.push("numero = ?");             values.push(data.numero); }
    if (data.id_establecimiento !== undefined) { fields.push("id_establecimiento = ?"); values.push(data.id_establecimiento); }
    if (data.id_departamento    !== undefined) { fields.push("id_departamento = ?");    values.push(data.id_departamento); }
    if (data.localidad          !== undefined) { fields.push("localidad = ?");          values.push(data.localidad); }
    if (data.barrio_zona        !== undefined) { fields.push("barrio_zona = ?");        values.push(data.barrio_zona); }
    if (data.es_accesible       !== undefined) { fields.push("es_accesible = ?");       values.push(data.es_accesible); }

    if (fields.length === 0) return;
    values.push(id);

    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        `UPDATE circuito SET ${fields.join(", ")} WHERE id_circuito = ?`,
        values
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Circuito con id (${id}) no encontrado`);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_DUP_ENTRY")
        throw new PC_BadRequest("Ya existe un circuito con ese número");
      if (err?.code === "ER_NO_REFERENCED_ROW_2")
        throw new PC_BadRequest("El establecimiento o departamento indicado no existe");
      throw new PC_InternalServerError();
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        "DELETE FROM circuito WHERE id_circuito = ?",
        [id]
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Circuito con id (${id}) no encontrado`);
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }
}
