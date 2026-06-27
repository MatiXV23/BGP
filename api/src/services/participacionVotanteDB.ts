import { type MySQLPromisePool } from "@fastify/mysql";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { BaseDBRepository } from "./baseRepository.js";
import type { ParticipacionVotante, ParticipacionVotantePost } from "../models/participacionVotanteModel.js";
import { PC_NotFound, PC_BadRequest, PC_InternalServerError } from "../errors/errors.js";

export class ParticipacionVotanteDB extends BaseDBRepository<ParticipacionVotante> {
  constructor(pool: MySQLPromisePool) {
    super(pool);
  }

  async getAll(): Promise<ParticipacionVotante[]> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        `SELECT id_participacion, credencial_civica, id_eleccion,
                DATE_FORMAT(fecha_hora, '%Y-%m-%dT%H:%i:%s') AS fecha_hora,
                es_observado, id_circuito
         FROM participacion_votante`
      );
      return rows as ParticipacionVotante[];
    } catch {
      throw new PC_InternalServerError();
    }
  }

  async getById(id: number): Promise<ParticipacionVotante> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        `SELECT id_participacion, credencial_civica, id_eleccion,
                DATE_FORMAT(fecha_hora, '%Y-%m-%dT%H:%i:%s') AS fecha_hora,
                es_observado, id_circuito
         FROM participacion_votante WHERE id_participacion = ?`,
        [id]
      );
      if (rows.length === 0)
        throw new PC_NotFound(`Participación con id (${id}) no encontrada`);
      return rows[0] as ParticipacionVotante;
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }

  async create(data: ParticipacionVotantePost): Promise<ParticipacionVotante> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        `INSERT INTO participacion_votante (credencial_civica, id_eleccion, es_observado, id_circuito)
         VALUES (?, ?, ?, ?)`,
        [data.credencial_civica, data.id_eleccion, data.es_observado, data.id_circuito]
      );
      return await this.getById(result.insertId);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_DUP_ENTRY")
        throw new PC_BadRequest("Este votante ya participó en esa elección");
      if (err?.code === "ER_NO_REFERENCED_ROW_2")
        throw new PC_BadRequest("La credencial, la elección o el circuito indicado no existe");
      throw new PC_InternalServerError();
    }
  }

  // Las participaciones son registros de auditoría: no se modifican ni eliminan
  async update(_id: number, _data: Partial<ParticipacionVotante>): Promise<void> {
    throw new PC_BadRequest("Las participaciones no pueden modificarse");
  }

  async delete(_id: number): Promise<void> {
    throw new PC_BadRequest("Las participaciones no pueden eliminarse");
  }
}
