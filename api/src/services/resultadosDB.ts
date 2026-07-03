import { type MySQLPromisePool } from "@fastify/mysql";
import type { RowDataPacket } from "mysql2";
import type {
  ResultadosEleccion,
  ResultadoPapeleta,
  ResultadoDepartamento,
  ResultadoPartido,
} from "../models/resultadosModel.js";
import { PC_InternalServerError } from "../errors/errors.js";

// Servicio de solo lectura: expone las vistas creadas en database/00_init.sql
// (v_resultados_eleccion, v_votos_por_departamento, v_votos_por_partido).
export class ResultadosDB {
  private pool: MySQLPromisePool;

  constructor(pool: MySQLPromisePool) {
    this.pool = pool;
  }

  async getResultadosPorEleccion(id_eleccion: number): Promise<ResultadosEleccion> {
    try {
      const [porPapeleta] = await this.pool.query<RowDataPacket[]>(
        `SELECT id_eleccion, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha, tipo_eleccion,
                id_papeleta, numero_lista, papeleta, partido,
                votos_emitidos, votos_validos, votos_anulados, votos_blancos, votos_observados
         FROM v_resultados_eleccion
         WHERE id_eleccion = ?
         ORDER BY votos_emitidos DESC, id_papeleta ASC`,
        [id_eleccion],
      );

      const [porDepartamento] = await this.pool.query<RowDataPacket[]>(
        `SELECT id_eleccion, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha, id_departamento, departamento,
                votos_emitidos, votos_validos, votos_anulados, votos_blancos, votos_observados
         FROM v_votos_por_departamento
         WHERE id_eleccion = ?
         ORDER BY votos_emitidos DESC, departamento ASC`,
        [id_eleccion],
      );

      const [porPartido] = await this.pool.query<RowDataPacket[]>(
        `SELECT id_eleccion, DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha, id_partido, partido,
                votos_emitidos, votos_validos, votos_anulados, votos_blancos, votos_observados
         FROM v_votos_por_partido
         WHERE id_eleccion = ?
         ORDER BY votos_emitidos DESC, partido ASC`,
        [id_eleccion],
      );

      return {
        porPapeleta: porPapeleta.map((r) => ({ ...r, numero_lista: r.numero_lista ?? undefined, papeleta: r.papeleta ?? undefined, partido: r.partido ?? undefined })) as ResultadoPapeleta[],
        porDepartamento: porDepartamento as ResultadoDepartamento[],
        porPartido: porPartido as ResultadoPartido[],
      };
    } catch {
      throw new PC_InternalServerError();
    }
  }
}
