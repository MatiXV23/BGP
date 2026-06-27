import { type MySQLPromisePool } from "@fastify/mysql";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { BaseDBRepository } from "./baseRepository.js";
import type { Voto, VotoPost } from "../models/votoModel.js";
import { PC_NotFound, PC_BadRequest, PC_InternalServerError } from "../errors/errors.js";

export class VotoDB extends BaseDBRepository<Voto> {
  constructor(pool: MySQLPromisePool) {
    super(pool);
  }

  async getAll(): Promise<Voto[]> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        `SELECT id_voto, id_circuito, id_eleccion,
                DATE_FORMAT(fecha_hora, '%Y-%m-%dT%H:%i:%s') AS fecha_hora,
                estado, es_observado
         FROM voto`
      );
      return rows as Voto[];
    } catch {
      throw new PC_InternalServerError();
    }
  }

  async getById(id: number): Promise<Voto> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        `SELECT id_voto, id_circuito, id_eleccion,
                DATE_FORMAT(fecha_hora, '%Y-%m-%dT%H:%i:%s') AS fecha_hora,
                estado, es_observado
         FROM voto WHERE id_voto = ?`,
        [id]
      );
      if (rows.length === 0)
        throw new PC_NotFound(`Voto con id (${id}) no encontrado`);
      return rows[0] as Voto;
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }

  async create(data: VotoPost): Promise<Voto> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        `INSERT INTO voto (id_circuito, id_eleccion, estado, es_observado)
         VALUES (?, ?, ?, ?)`,
        [data.id_circuito, data.id_eleccion, data.estado, data.es_observado]
      );
      return await this.getById(result.insertId);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_NO_REFERENCED_ROW_2")
        throw new PC_BadRequest("El circuito o la elección indicada no existe");
      throw new PC_InternalServerError();
    }
  }

  // Los votos son inmutables por integridad electoral
  async update(_id: number, _data: Partial<Voto>): Promise<void> {
    throw new PC_BadRequest("Los votos no pueden modificarse");
  }

  async delete(_id: number): Promise<void> {
    throw new PC_BadRequest("Los votos no pueden eliminarse");
  }
}
