import { type MySQLPromisePool } from "@fastify/mysql";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { BaseDBRepository } from "./baseRepository.js";
import type { Mesa, MesaActual, MesaPost } from "../models/mesaModel.js";
import { PC_NotFound, PC_BadRequest, PC_InternalServerError } from "../errors/errors.js";

export class MesaDB extends BaseDBRepository<Mesa> {
  constructor(pool: MySQLPromisePool) {
    super(pool);
  }

  async getAll(): Promise<Mesa[]> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        `SELECT id_mesa, id_circuito, id_eleccion,
                ci_presidente, ci_secretario, ci_vocal, estado
         FROM mesa`
      );
      return rows as Mesa[];
    } catch {
      throw new PC_InternalServerError();
    }
  }

  async getById(id: number): Promise<Mesa> {
    try {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        `SELECT id_mesa, id_circuito, id_eleccion,
                ci_presidente, ci_secretario, ci_vocal, estado
         FROM mesa WHERE id_mesa = ?`,
        [id]
      );
      if (rows.length === 0)
        throw new PC_NotFound(`Mesa con id (${id}) no encontrada`);
      return rows[0] as Mesa;
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }

  async create(data: MesaPost): Promise<Mesa> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        `INSERT INTO mesa (id_circuito, id_eleccion, ci_presidente, ci_secretario, ci_vocal)
         VALUES (?, ?, ?, ?, ?)`,
        [data.id_circuito, data.id_eleccion, data.ci_presidente, data.ci_secretario, data.ci_vocal]
      );
      return await this.getById(result.insertId);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_DUP_ENTRY")
        throw new PC_BadRequest("Ya existe una mesa para ese circuito y elección");
      if (err?.code === "ER_NO_REFERENCED_ROW_2")
        throw new PC_BadRequest("El circuito, la elección o algún miembro de mesa indicado no existe");
      throw new PC_InternalServerError();
    }
  }

  async update(id: number, data: Partial<Mesa>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.id_circuito    !== undefined) { fields.push("id_circuito = ?");    values.push(data.id_circuito); }
    if (data.id_eleccion    !== undefined) { fields.push("id_eleccion = ?");    values.push(data.id_eleccion); }
    if (data.ci_presidente  !== undefined) { fields.push("ci_presidente = ?");  values.push(data.ci_presidente); }
    if (data.ci_secretario  !== undefined) { fields.push("ci_secretario = ?");  values.push(data.ci_secretario); }
    if (data.ci_vocal       !== undefined) { fields.push("ci_vocal = ?");       values.push(data.ci_vocal); }

    if (fields.length === 0) return;
    values.push(id);

    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        `UPDATE mesa SET ${fields.join(", ")} WHERE id_mesa = ?`,
        values
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Mesa con id (${id}) no encontrada`);
    } catch (err: any) {
      if (err instanceof PC_NotFound) throw err;
      if (err?.code === "ER_DUP_ENTRY")
        throw new PC_BadRequest("Ya existe una mesa para ese circuito y elección");
      if (err?.code === "ER_NO_REFERENCED_ROW_2")
        throw new PC_BadRequest("El circuito, la elección o algún miembro de mesa indicado no existe");
      throw new PC_InternalServerError();
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const [result] = await this.pool.query<ResultSetHeader>(
        "DELETE FROM mesa WHERE id_mesa = ?",
        [id]
      );
      if (result.affectedRows === 0)
        throw new PC_NotFound(`Mesa con id (${id}) no encontrada`);
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }

  async cerrar(id: number): Promise<Mesa> {
    const mesa = await this.getById(id);
    if (mesa.estado === "Cerrada")
      throw new PC_BadRequest("La mesa ya está cerrada");

    try {
      await this.pool.query<ResultSetHeader>(
        "UPDATE mesa SET estado = 'Cerrada' WHERE id_mesa = ? AND estado = 'Abierta'",
        [id]
      );
      return await this.getById(id);
    } catch {
      throw new PC_InternalServerError();
    }
  }

  // Mesa donde el ciudadano logeado integra la autoridad (presidente, secretario o vocal).
  // Si integra varias (una por elección), prioriza la que esté abierta y luego la más reciente.
  async getMia(cedula_identidad: string): Promise<MesaActual> {
    try {
      const [mesaRows] = await this.pool.query<RowDataPacket[]>(
        `SELECT m.id_mesa, m.id_circuito, m.id_eleccion,
                m.ci_presidente, m.ci_secretario, m.ci_vocal, m.estado
         FROM mesa m
         JOIN eleccion e ON e.id_eleccion = m.id_eleccion
         WHERE ? IN (m.ci_presidente, m.ci_secretario, m.ci_vocal)
         ORDER BY (m.estado = 'Abierta') DESC, e.fecha DESC
         LIMIT 1`,
        [cedula_identidad]
      );
      if (mesaRows.length === 0)
        throw new PC_NotFound("El usuario no integra ninguna mesa de votación");
      const mesa = mesaRows[0];

      const [circuitoRows] = await this.pool.query<RowDataPacket[]>(
        `SELECT c.numero AS numero_circuito, c.localidad, c.barrio_zona, c.es_accesible,
                es.id_establecimiento, es.nombre AS establecimiento, es.tipo AS tipo_establecimiento,
                z.nombre AS zona,
                d.id_departamento, d.nombre AS departamento,
                (SELECT COUNT(*) FROM circuito c2 WHERE c2.id_establecimiento = es.id_establecimiento) AS circuitos_en_establecimiento
         FROM circuito c
         JOIN establecimiento es ON es.id_establecimiento = c.id_establecimiento
         JOIN zona z ON z.id_zona = es.id_zona
         JOIN departamento d ON d.id_departamento = c.id_departamento
         WHERE c.id_circuito = ?`,
        [mesa.id_circuito]
      );
      const circuito = circuitoRows[0];

      const [eleccionRows] = await this.pool.query<RowDataPacket[]>(
        `SELECT DATE_FORMAT(e.fecha, '%Y-%m-%d') AS eleccion_fecha, te.nombre AS eleccion_tipo, e.descripcion AS eleccion_descripcion
         FROM eleccion e
         JOIN tipo_eleccion te ON te.id_tipo = e.id_tipo
         WHERE e.id_eleccion = ?`,
        [mesa.id_eleccion]
      );
      const eleccion = eleccionRows[0];

      const [integrantesRows] = await this.pool.query<RowDataPacket[]>(
        `SELECT cedula_identidad, nombre_completo FROM ciudadano
         WHERE cedula_identidad IN (?, ?, ?)`,
        [mesa.ci_presidente, mesa.ci_secretario, mesa.ci_vocal]
      );
      const porCedula = new Map(integrantesRows.map((r) => [r.cedula_identidad, r.nombre_completo]));

      const [habilitadosRows] = await this.pool.query<RowDataPacket[]>(
        "SELECT COUNT(*) AS habilitados FROM circuito_credencial WHERE id_circuito = ?",
        [mesa.id_circuito]
      );

      const [votosRows] = await this.pool.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS votos_emitidos,
                SUM(estado = 'Valido')  AS votos_validos,
                SUM(estado = 'Anulado') AS votos_anulados,
                SUM(estado = 'Blanco')  AS votos_blancos,
                SUM(es_observado = TRUE) AS votos_observados
         FROM voto WHERE id_circuito = ? AND id_eleccion = ?`,
        [mesa.id_circuito, mesa.id_eleccion]
      );
      const votos = votosRows[0];

      const [seguridadRows] = await this.pool.query<RowDataPacket[]>(
        `SELECT c.cedula_identidad, c.nombre_completo, co.nombre AS comisaria
         FROM asignacion_policial ap
         JOIN agente_policial ag ON ag.cedula_identidad = ap.cedula_agente
         JOIN ciudadano c        ON c.cedula_identidad  = ag.cedula_identidad
         JOIN comisaria co       ON co.id_comisaria     = ag.id_comisaria
         WHERE ap.id_establecimiento = ? AND ap.id_eleccion = ?`,
        [circuito.id_establecimiento, mesa.id_eleccion]
      );

      const [papeletasRows] = await this.pool.query<RowDataPacket[]>(
        `SELECT p.id_papeleta, p.numero_lista, p.descripcion, p.color,
                pp.nombre AS partido, p.organo_candidatura,
                COUNT(v.id_voto) AS votos
         FROM papeleta p
         LEFT JOIN partido_politico pp ON pp.id_partido = p.id_partido
         LEFT JOIN voto_papeleta vp    ON vp.id_papeleta = p.id_papeleta
         LEFT JOIN voto v              ON v.id_voto = vp.id_voto
                                       AND v.id_circuito = ?
                                       AND v.estado = 'Valido'
         WHERE p.id_eleccion = ?
           AND (p.id_departamento IS NULL OR p.id_departamento = ?)
         GROUP BY p.id_papeleta, p.numero_lista, p.descripcion, p.color, pp.nombre, p.organo_candidatura
         ORDER BY votos DESC, p.id_papeleta ASC`,
        [mesa.id_circuito, mesa.id_eleccion, circuito.id_departamento]
      );

      return {
        id_mesa: mesa.id_mesa,
        estado: mesa.estado,

        id_circuito: mesa.id_circuito,
        numero_circuito: circuito.numero_circuito,
        localidad: circuito.localidad,
        barrio_zona: circuito.barrio_zona ?? undefined,
        es_accesible: !!circuito.es_accesible,

        id_establecimiento: circuito.id_establecimiento,
        establecimiento: circuito.establecimiento,
        tipo_establecimiento: circuito.tipo_establecimiento,
        zona: circuito.zona,
        circuitos_en_establecimiento: circuito.circuitos_en_establecimiento,

        id_departamento: circuito.id_departamento,
        departamento: circuito.departamento,

        id_eleccion: mesa.id_eleccion,
        eleccion_fecha: eleccion.eleccion_fecha,
        eleccion_tipo: eleccion.eleccion_tipo,
        eleccion_descripcion: eleccion.eleccion_descripcion ?? undefined,

        presidente: { cedula_identidad: mesa.ci_presidente, nombre_completo: porCedula.get(mesa.ci_presidente) },
        secretario: { cedula_identidad: mesa.ci_secretario, nombre_completo: porCedula.get(mesa.ci_secretario) },
        vocal: { cedula_identidad: mesa.ci_vocal, nombre_completo: porCedula.get(mesa.ci_vocal) },

        habilitados: habilitadosRows[0].habilitados,
        votos_emitidos: votos.votos_emitidos,
        votos_validos: votos.votos_validos ?? 0,
        votos_anulados: votos.votos_anulados ?? 0,
        votos_blancos: votos.votos_blancos ?? 0,
        votos_observados: votos.votos_observados ?? 0,

        seguridad: seguridadRows as MesaActual["seguridad"],
        papeletas: papeletasRows.map((p) => ({
          id_papeleta: p.id_papeleta,
          numero_lista: p.numero_lista ?? undefined,
          descripcion: p.descripcion ?? undefined,
          color: p.color ?? undefined,
          partido: p.partido ?? undefined,
          organo_candidatura: p.organo_candidatura ?? undefined,
          votos: p.votos,
        })) as MesaActual["papeletas"],
      } as MesaActual;
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }
}
