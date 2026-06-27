import { type MySQLPromisePool } from "@fastify/mysql";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { BaseDBRepository } from "./baseRepository.js";
import type { Papeleta, PapeletaPost } from "../models/papeletaModel.js";
import { PC_NotFound, PC_BadRequest, PC_InternalServerError } from "../errors/errors.js";

export class PapeletaDB extends BaseDBRepository<Papeleta> {
  constructor(pool: MySQLPromisePool) {
    super(pool);
  }

  async getAll(): Promise<Papeleta[]> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        `SELECT id_papeleta, id_eleccion, numero_lista, es_lista,
                descripcion, color, id_partido, organo_candidatura, id_departamento
         FROM papeleta`
      );
      return rows as Papeleta[];
    } catch {
      throw new PC_InternalServerError();
    }
  }

  async getById(id: number): Promise<Papeleta> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        `SELECT id_papeleta, id_eleccion, numero_lista, es_lista,
                descripcion, color, id_partido, organo_candidatura, id_departamento
         FROM papeleta WHERE id_papeleta = ?`,
        [id]
      );
      if (rows.length === 0)
        throw new PC_NotFound(`Papeleta con id (${id}) no encontrada`);
      return rows[0] as Papeleta;
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }

  async create(data: PapeletaPost): Promise<Papeleta> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        `INSERT INTO papeleta
           (id_eleccion, numero_lista, es_lista, descripcion, color, id_partido, organo_candidatura, id_departamento)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.id_eleccion,
          data.numero_lista  ?? null,
          data.es_lista,
          data.descripcion   ?? null,
          data.color         ?? null,
          data.id_partido    ?? null,
          data.organo_candidatura ?? null,
          data.id_departamento    ?? null,
        ]
      );
      return await this.getById(result.insertId);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_DUP_ENTRY")
        throw new PC_BadRequest("Ya existe una papeleta con ese número de lista");
      if (err?.code === "ER_NO_REFERENCED_ROW_2")
        throw new PC_BadRequest("La elección, el partido o el departamento indicado no existe");
      throw new PC_InternalServerError();
    }
  }

  async update(id: number, data: Partial<Papeleta>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.id_eleccion        !== undefined) { fields.push("id_eleccion = ?");        values.push(data.id_eleccion); }
    if (data.numero_lista       !== undefined) { fields.push("numero_lista = ?");       values.push(data.numero_lista); }
    if (data.es_lista           !== undefined) { fields.push("es_lista = ?");           values.push(data.es_lista); }
    if (data.descripcion        !== undefined) { fields.push("descripcion = ?");        values.push(data.descripcion); }
    if (data.color              !== undefined) { fields.push("color = ?");              values.push(data.color); }
    if (data.id_partido         !== undefined) { fields.push("id_partido = ?");         values.push(data.id_partido); }
    if (data.organo_candidatura !== undefined) { fields.push("organo_candidatura = ?"); values.push(data.organo_candidatura); }
    if (data.id_departamento    !== undefined) { fields.push("id_departamento = ?");    values.push(data.id_departamento); }

    if (fields.length === 0) return;
    values.push(id);

    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        `UPDATE papeleta SET ${fields.join(", ")} WHERE id_papeleta = ?`,
        values
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Papeleta con id (${id}) no encontrada`);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_DUP_ENTRY")
        throw new PC_BadRequest("Ya existe una papeleta con ese número de lista");
      if (err?.code === "ER_NO_REFERENCED_ROW_2")
        throw new PC_BadRequest("La elección, el partido o el departamento indicado no existe");
      throw new PC_InternalServerError();
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        "DELETE FROM papeleta WHERE id_papeleta = ?",
        [id]
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Papeleta con id (${id}) no encontrada`);
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }
}
