import { type MySQLPromisePool } from "@fastify/mysql";
import type { RowDataPacket } from "mysql2";
import { PC_InternalServerError } from "../errors/errors.js";
import type {
  VotosPorPartido,
  VotosPorDepartamento,
  ResultadoEleccion,
} from "../models/reporetsModel.js";

function normalizarFecha(fecha: unknown): string {
  if (fecha instanceof Date) {
    return fecha.toISOString().slice(0, 10);
  }

  return String(fecha);
}

export class ReportesDB {
  constructor(private readonly pool: MySQLPromisePool) {}

  async getResultadosEleccion(): Promise<ResultadoEleccion[]> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        `
        SELECT
          id_eleccion,
          fecha,
          tipo_eleccion,
          id_papeleta,
          numero_lista,
          papeleta,
          partido,
          votos_emitidos,
          votos_validos,
          votos_anulados,
          votos_blancos,
          votos_observados
        FROM v_resultados_eleccion
        ORDER BY id_eleccion, id_papeleta
        `,
      );

      return rows.map((row) => ({
        id_eleccion: Number(row.id_eleccion),
        fecha: normalizarFecha(row.fecha),
        tipo_eleccion: String(row.tipo_eleccion),

        id_papeleta: Number(row.id_papeleta),
        numero_lista: row.numero_lista ?? undefined,
        papeleta: row.papeleta ?? undefined,
        partido: row.partido ?? undefined,

        votos_emitidos: Number(row.votos_emitidos ?? 0),
        votos_validos: Number(row.votos_validos ?? 0),
        votos_anulados: Number(row.votos_anulados ?? 0),
        votos_blancos: Number(row.votos_blancos ?? 0),
        votos_observados: Number(row.votos_observados ?? 0),
      }));
    } catch (error) {
      console.error("Error en ReportesDB.getResultadosEleccion:", error);
      throw new PC_InternalServerError();
    }
  }

  async getVotosPorDepartamento(): Promise<VotosPorDepartamento[]> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        `
        SELECT
          id_eleccion,
          fecha,
          id_departamento,
          departamento,
          votos_emitidos,
          votos_validos,
          votos_anulados,
          votos_blancos,
          votos_observados
        FROM v_votos_por_departamento
        ORDER BY id_eleccion, departamento
        `,
      );

      return rows.map((row) => ({
        id_eleccion: Number(row.id_eleccion),
        fecha: normalizarFecha(row.fecha),

        id_departamento: Number(row.id_departamento),
        departamento: String(row.departamento),

        votos_emitidos: Number(row.votos_emitidos ?? 0),
        votos_validos: Number(row.votos_validos ?? 0),
        votos_anulados: Number(row.votos_anulados ?? 0),
        votos_blancos: Number(row.votos_blancos ?? 0),
        votos_observados: Number(row.votos_observados ?? 0),
      }));
    } catch (error) {
      console.error("Error en ReportesDB.getVotosPorDepartamento:", error);
      throw new PC_InternalServerError();
    }
  }

  async getVotosPorPartido(): Promise<VotosPorPartido[]> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        `
        SELECT
          id_eleccion,
          fecha,
          id_partido,
          partido,
          votos_emitidos,
          votos_validos,
          votos_anulados,
          votos_blancos,
          votos_observados
        FROM v_votos_por_partido
        ORDER BY id_eleccion, partido
        `,
      );

      return rows.map((row) => ({
        id_eleccion: Number(row.id_eleccion),
        fecha: normalizarFecha(row.fecha),

        id_partido: Number(row.id_partido),
        partido: String(row.partido),

        votos_emitidos: Number(row.votos_emitidos ?? 0),
        votos_validos: Number(row.votos_validos ?? 0),
        votos_anulados: Number(row.votos_anulados ?? 0),
        votos_blancos: Number(row.votos_blancos ?? 0),
        votos_observados: Number(row.votos_observados ?? 0),
      }));
    } catch (error) {
      console.error("Error en ReportesDB.getVotosPorPartido:", error);
      throw new PC_InternalServerError();
    }
  }
}
