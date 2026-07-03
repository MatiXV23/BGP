import { type MySQLPromisePool } from "@fastify/mysql";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { BaseDBRepository } from "./baseRepository.js";
import type {
  Mesa,
  MesaActual,
  MesaPost,
  VerificarVotanteBody,
  VerificarVotanteResponse,
  EmitirVotoBody,
  EmitirVotoResponse,
} from "../models/mesaModel.js";
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
  // Si integra varias (una por elección), prioriza siempre la de la elección más reciente;
  // si tiene más de una mesa en esa misma elección, ahí sí desempata por la que esté abierta.
  // (Priorizar "abierta" por sobre "más reciente" hacía que, al cerrar la mesa de la elección
  // actual, la app saltara a mostrar una mesa de una elección vieja que seguía abierta.)
  private async getMesaAutoridad(cedula_identidad: string): Promise<RowDataPacket> {
    const [mesaRows] = await this.pool.query<RowDataPacket[]>(
      `SELECT m.id_mesa, m.id_circuito, m.id_eleccion,
              m.ci_presidente, m.ci_secretario, m.ci_vocal, m.estado
       FROM mesa m
       JOIN eleccion e ON e.id_eleccion = m.id_eleccion
       WHERE ? IN (m.ci_presidente, m.ci_secretario, m.ci_vocal)
       ORDER BY e.fecha DESC, (m.estado = 'Abierta') DESC
       LIMIT 1`,
      [cedula_identidad]
    );
    if (mesaRows.length === 0)
      throw new PC_NotFound("El usuario no integra ninguna mesa de votación");
    return mesaRows[0];
  }

  // Mesa del circuito donde el ciudadano logeado está habilitado para votar (padrón).
  // Es independiente de si integra o no la autoridad de esa mesa. Mismo criterio de
  // desempate que getMesaAutoridad: elección más reciente primero.
  private async getMesaDeMiCircuito(cedula_identidad: string): Promise<RowDataPacket> {
    const [mesaRows] = await this.pool.query<RowDataPacket[]>(
      `SELECT m.id_mesa, m.id_circuito, m.id_eleccion,
              m.ci_presidente, m.ci_secretario, m.ci_vocal, m.estado
       FROM ciudadano c
       JOIN circuito_credencial cc ON cc.credencial_civica = c.credencial_civica
       JOIN mesa m                 ON m.id_circuito = cc.id_circuito
       JOIN eleccion e             ON e.id_eleccion = m.id_eleccion
       WHERE c.cedula_identidad = ?
       ORDER BY e.fecha DESC, (m.estado = 'Abierta') DESC
       LIMIT 1`,
      [cedula_identidad]
    );
    if (mesaRows.length === 0)
      throw new PC_NotFound("El usuario no está habilitado para votar en ninguna mesa");
    return mesaRows[0];
  }

  private async enrichMesaActual(mesa: RowDataPacket): Promise<MesaActual> {
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
  }

  // Mesa donde el usuario logeado integra la autoridad (para el panel principal y el cierre de mesa)
  async getMia(cedula_identidad: string): Promise<MesaActual> {
    try {
      const mesa = await this.getMesaAutoridad(cedula_identidad);
      return await this.enrichMesaActual(mesa);
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }

  // Mesa donde el usuario logeado está habilitado para votar (para la pantalla de votación)
  async getMiaVotacion(cedula_identidad: string): Promise<MesaActual> {
    try {
      const mesa = await this.getMesaDeMiCircuito(cedula_identidad);
      return await this.enrichMesaActual(mesa);
    } catch (err) {
      if (err instanceof PC_NotFound) throw err;
      throw new PC_InternalServerError();
    }
  }

  private async resolveCircuito(numero: string): Promise<number> {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      "SELECT id_circuito FROM circuito WHERE numero = ?",
      [numero],
    );
    if (rows.length === 0)
      throw new PC_BadRequest(`No existe ningún circuito con el número (${numero})`);
    return rows[0].id_circuito;
  }


  // Verifica que el usuario logeado (y solo él, con su propia credencial) pueda votar en su mesa:
  // si ya votó en esta elección y si el circuito ingresado coincide con el asignado por padrón.
  async verificarVotante(
    cedula_identidad: string,
    data: VerificarVotanteBody,
  ): Promise<VerificarVotanteResponse> {
    try {
      const mesa = await this.getMesaDeMiCircuito(cedula_identidad);
      if (mesa.estado === "Cerrada")
        throw new PC_BadRequest("La mesa está cerrada, no se pueden procesar votos");

      const [ciudadanoRows] = await this.pool.query<RowDataPacket[]>(
        "SELECT nombre_completo, credencial_civica FROM ciudadano WHERE cedula_identidad = ?",
        [cedula_identidad],
      );
      const ciudadano = ciudadanoRows[0];

      const id_circuito_ingresado = await this.resolveCircuito(data.numero_circuito_ingresado);

      const [participacionRows] = await this.pool.query<RowDataPacket[]>(
        "SELECT 1 FROM participacion_votante WHERE credencial_civica = ? AND id_eleccion = ?",
        [ciudadano.credencial_civica, mesa.id_eleccion],
      );

      const [padronRows] = await this.pool.query<RowDataPacket[]>(
        "SELECT 1 FROM circuito_credencial WHERE id_circuito = ? AND credencial_civica = ?",
        [id_circuito_ingresado, ciudadano.credencial_civica],
      );

      return {
        nombre_completo: ciudadano.nombre_completo,
        ya_voto: participacionRows.length > 0,
        observado: padronRows.length === 0,
      };
    } catch (err) {
      if (err instanceof PC_NotFound || err instanceof PC_BadRequest) throw err;
      throw new PC_InternalServerError();
    }
  }

  // Registra la participación (bloquea doble voto vía UNIQUE) y el voto del usuario logeado,
  // siempre con su propia credencial: nadie puede votar en nombre de otro ciudadano.
  async emitirVoto(
    cedula_identidad: string,
    data: EmitirVotoBody,
  ): Promise<EmitirVotoResponse> {
    try {
      const mesa = await this.getMesaDeMiCircuito(cedula_identidad);
      if (mesa.estado === "Cerrada")
        throw new PC_BadRequest("La mesa está cerrada, no se pueden emitir votos");

      const [ciudadanoRows] = await this.pool.query<RowDataPacket[]>(
        "SELECT credencial_civica FROM ciudadano WHERE cedula_identidad = ?",
        [cedula_identidad],
      );
      const credencial_civica = ciudadanoRows[0].credencial_civica;

      const id_circuito_ingresado = await this.resolveCircuito(data.numero_circuito_ingresado);

      const [padronRows] = await this.pool.query<RowDataPacket[]>(
        "SELECT 1 FROM circuito_credencial WHERE id_circuito = ? AND credencial_civica = ?",
        [id_circuito_ingresado, credencial_civica],
      );
      const observado = padronRows.length === 0;

      try {
        await this.pool.query<ResultSetHeader>(
          `INSERT INTO participacion_votante (credencial_civica, id_eleccion, es_observado, id_circuito)
           VALUES (?, ?, ?, ?)`,
          [credencial_civica, mesa.id_eleccion, observado, mesa.id_circuito],
        );
      } catch (err: any) {
        if (err?.code === "ER_DUP_ENTRY")
          throw new PC_BadRequest("Ya emitiste tu voto en esta elección");
        throw err;
      }

      let estado: "Valido" | "Anulado" | "Blanco" = data.id_papeletas.length === 0 ? "Blanco" : "Valido";

      if (data.id_papeletas.length > 1) {
        const [papeletaRows] = await this.pool.query<RowDataPacket[]>(
          "SELECT organo_candidatura FROM papeleta WHERE id_papeleta IN (?)",
          [data.id_papeletas],
        );
        const conteoPorOrgano = new Map<string, number>();
        for (const p of papeletaRows) {
          const clave = p.organo_candidatura ?? "__principal__";
          conteoPorOrgano.set(clave, (conteoPorOrgano.get(clave) ?? 0) + 1);
        }
        // Más de una papeleta para el mismo cargo (mismo organo_candidatura, o ambas
        // para el cargo principal si organo_candidatura es NULL) es un sobrevoto: se anula.
        if ([...conteoPorOrgano.values()].some((cantidad) => cantidad > 1)) estado = "Anulado";
      }

      const [votoResult] = await this.pool.query<ResultSetHeader>(
        "INSERT INTO voto (id_circuito, id_eleccion, estado, es_observado) VALUES (?, ?, ?, ?)",
        [mesa.id_circuito, mesa.id_eleccion, estado, observado],
      );
      const id_voto = votoResult.insertId;

      for (const id_papeleta of data.id_papeletas) {
        await this.pool.query<ResultSetHeader>(
          "INSERT INTO voto_papeleta (id_voto, id_papeleta) VALUES (?, ?)",
          [id_voto, id_papeleta],
        );
      }

      return { id_voto, estado, observado };
    } catch (err) {
      if (err instanceof PC_NotFound || err instanceof PC_BadRequest) throw err;
      throw new PC_InternalServerError();
    }
  }
}
