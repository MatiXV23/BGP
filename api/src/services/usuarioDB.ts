import { type MySQLPromisePool } from "@fastify/mysql";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { BaseDBRepository } from "./baseRepository.js";
import type { Usuario, UsuarioPost, JWTUsuario } from "../models/usuarioModel.js";
import { PC_NotFound, PC_BadRequest, PC_NoAuthorized, PC_InternalServerError } from "../errors/errors.js";

const SELECT_USUARIO = `
  SELECT u.id_usuario, u.cedula_identidad, u.is_admin, c.nombre_completo
  FROM usuarios u
  JOIN ciudadano c ON c.cedula_identidad = u.cedula_identidad
`;

// mysql2 devuelve las columnas BOOLEAN/TINYINT(1) como 0/1, no como boolean
function toUsuario(row: RowDataPacket): Usuario {
  return { ...row, is_admin: !!row.is_admin } as Usuario;
}

export class UsuarioDB extends BaseDBRepository<Usuario> {
  constructor(pool: MySQLPromisePool) {
    super(pool);
  }

  async getAll(): Promise<Usuario[]> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(SELECT_USUARIO);
      return rows.map(toUsuario);
    } catch {
      throw new PC_InternalServerError();
    }
  }

  async getById(id: number): Promise<Usuario> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        `${SELECT_USUARIO} WHERE u.id_usuario = ?`,
        [id]
      );
      if (rows.length === 0)
        throw new PC_NotFound(`Usuario con id (${id}) no encontrado`);
      return toUsuario(rows[0]);
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }

  async create(data: UsuarioPost): Promise<Usuario> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        `INSERT INTO usuarios (cedula_identidad, is_admin) VALUES (?, ?)`,
        [data.cedula_identidad, data.is_admin ?? false]
      );
      await this.pool.query<ResultSetHeader>(
        `INSERT INTO credenciales (id_usuario, password_hash) VALUES (?, SHA2(?, 512))`,
        [result.insertId, data.password]
      );
      return await this.getById(result.insertId);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_NO_REFERENCED_ROW_2")
        throw new PC_BadRequest("La cédula indicada no corresponde a un ciudadano registrado");
      if (err?.code === "ER_DUP_ENTRY")
        throw new PC_BadRequest("Esa cédula ya tiene un usuario registrado");
      throw new PC_InternalServerError();
    }
  }

  async update(id: number, data: Partial<Usuario>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.cedula_identidad !== undefined) { fields.push("cedula_identidad = ?"); values.push(data.cedula_identidad); }
    if (data.is_admin         !== undefined) { fields.push("is_admin = ?");         values.push(data.is_admin); }

    if (fields.length === 0) return;
    values.push(id);

    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        `UPDATE usuarios SET ${fields.join(", ")} WHERE id_usuario = ?`,
        values
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Usuario con id (${id}) no encontrado`);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_NO_REFERENCED_ROW_2")
        throw new PC_BadRequest("La cédula indicada no corresponde a un ciudadano registrado");
      throw new PC_InternalServerError();
    }
  }

  async updatePassword(id: number, password: string): Promise<void> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        `UPDATE credenciales SET password_hash = SHA2(?, 512) WHERE id_usuario = ?`,
        [password, id]
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Usuario con id (${id}) no encontrado`);
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.pool.query<ResultSetHeader>(
        `DELETE FROM credenciales WHERE id_usuario = ?`,
        [id]
      );
      const [result] = await this.pool.query<ResultSetHeader>(
        `DELETE FROM usuarios WHERE id_usuario = ?`,
        [id]
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Usuario con id (${id}) no encontrado`);
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }

  async verifyCredentials(cedula_identidad: string, password: string): Promise<JWTUsuario> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        `SELECT u.id_usuario, u.cedula_identidad, u.is_admin
         FROM usuarios u
         JOIN credenciales c ON c.id_usuario = u.id_usuario
         WHERE u.cedula_identidad = ? AND c.password_hash = SHA2(?, 512)`,
        [cedula_identidad, password]
      );
      if (rows.length === 0)
        throw new PC_NoAuthorized("Cédula o contraseña incorrecta");
      const row = rows[0];
      return { ...row, is_admin: !!row.is_admin } as JWTUsuario;
    } catch (err) {
      if (err instanceof PC_NoAuthorized) throw err;
      throw new PC_InternalServerError();
    }
  }
}
