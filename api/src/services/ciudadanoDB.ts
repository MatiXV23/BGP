import { type MySQLPromisePool } from "@fastify/mysql";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { BaseDBRepository } from "./baseRepository.js";
import type { Ciudadano, CiudadanoPost } from "../models/ciudadanoModel.js";
import { PC_NotFound, PC_BadRequest, PC_InternalServerError } from "../errors/errors.js";

export class CiudadanoDB extends BaseDBRepository<Ciudadano> {
  constructor(pool: MySQLPromisePool) {
    super(pool);
  }

  async getAll(): Promise<Ciudadano[]> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        `SELECT cedula_identidad, credencial_civica, nombre_completo,
                DATE_FORMAT(fecha_nacimiento, '%Y-%m-%d') AS fecha_nacimiento
         FROM ciudadano`
      );
      return rows as Ciudadano[];
    } catch {
      throw new PC_InternalServerError();
    }
  }

  // PK es string (CHAR 8), sobreescribimos la firma
  async getById(cedula: string): Promise<Ciudadano> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        `SELECT cedula_identidad, credencial_civica, nombre_completo,
                DATE_FORMAT(fecha_nacimiento, '%Y-%m-%d') AS fecha_nacimiento
         FROM ciudadano WHERE cedula_identidad = ?`,
        [cedula]
      );
      if (rows.length === 0)
        throw new PC_NotFound(`Ciudadano con cédula (${cedula}) no encontrado`);
      return rows[0] as Ciudadano;
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }

  async create(data: CiudadanoPost): Promise<Ciudadano> {
    try {
      await this.pool.query<ResultSetHeader>(
        `INSERT INTO ciudadano (cedula_identidad, credencial_civica, nombre_completo, fecha_nacimiento)
         VALUES (?, ?, ?, ?)`,
        [data.cedula_identidad, data.credencial_civica, data.nombre_completo, data.fecha_nacimiento]
      );
      return await this.getById(data.cedula_identidad);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_DUP_ENTRY") {
        if (err.message.includes("credencial_civica"))
          throw new PC_BadRequest("Esa credencial cívica ya está registrada");
        throw new PC_BadRequest("Esa cédula de identidad ya está registrada");
      }
      throw new PC_InternalServerError();
    }
  }

  async update(cedula: string, data: Partial<Ciudadano>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.credencial_civica !== undefined) { fields.push("credencial_civica = ?"); values.push(data.credencial_civica); }
    if (data.nombre_completo   !== undefined) { fields.push("nombre_completo = ?");   values.push(data.nombre_completo); }
    if (data.fecha_nacimiento  !== undefined) { fields.push("fecha_nacimiento = ?");  values.push(data.fecha_nacimiento); }

    if (fields.length === 0) return;
    values.push(cedula);

    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        `UPDATE ciudadano SET ${fields.join(", ")} WHERE cedula_identidad = ?`,
        values
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Ciudadano con cédula (${cedula}) no encontrado`);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_DUP_ENTRY")
        throw new PC_BadRequest("Esa credencial cívica ya está registrada");
      throw new PC_InternalServerError();
    }
  }

  async delete(cedula: string): Promise<void> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        "DELETE FROM ciudadano WHERE cedula_identidad = ?",
        [cedula]
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Ciudadano con cédula (${cedula}) no encontrado`);
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }
}
