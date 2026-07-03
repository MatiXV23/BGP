import { type Static, Type } from "@fastify/type-provider-typebox";

export const MesaEstadoEnum = Type.Union([
  Type.Literal("Abierta"),
  Type.Literal("Cerrada"),
]);

export const mesaModel = Type.Object({
  id_mesa: Type.Integer(),
  id_circuito: Type.Integer(),
  id_eleccion: Type.Integer(),
  ci_presidente: Type.String({ maxLength: 8 }),
  ci_secretario: Type.String({ maxLength: 8 }),
  ci_vocal: Type.String({ maxLength: 8 }),
  estado: MesaEstadoEnum,
});
export type Mesa = Static<typeof mesaModel>;

export const mesaPostModel = Type.Object({
  id_circuito: Type.Integer(),
  id_eleccion: Type.Integer(),
  ci_presidente: Type.String({ maxLength: 8 }),
  ci_secretario: Type.String({ maxLength: 8 }),
  ci_vocal: Type.String({ maxLength: 8 }),
});
export type MesaPost = Static<typeof mesaPostModel>;

const integranteModel = Type.Object({
  cedula_identidad: Type.String({ maxLength: 8 }),
  nombre_completo: Type.String({ maxLength: 150 }),
});

const agenteSeguridadModel = Type.Object({
  cedula_identidad: Type.String({ maxLength: 8 }),
  nombre_completo: Type.String({ maxLength: 150 }),
  comisaria: Type.String({ maxLength: 100 }),
});

const papeletaResultadoModel = Type.Object({
  id_papeleta: Type.Integer(),
  numero_lista: Type.Optional(Type.Integer()),
  descripcion: Type.Optional(Type.String()),
  color: Type.Optional(Type.String()),
  partido: Type.Optional(Type.String()),
  organo_candidatura: Type.Optional(Type.String()),
  votos: Type.Integer(),
});

// Vista compuesta con todo lo necesario para el panel principal de la mesa del usuario logeado
export const mesaActualModel = Type.Object({
  id_mesa: Type.Integer(),
  estado: MesaEstadoEnum,

  id_circuito: Type.Integer(),
  numero_circuito: Type.String(),
  localidad: Type.String(),
  barrio_zona: Type.Optional(Type.String()),
  es_accesible: Type.Boolean(),

  id_establecimiento: Type.Integer(),
  establecimiento: Type.String(),
  tipo_establecimiento: Type.String(),
  zona: Type.String(),
  circuitos_en_establecimiento: Type.Integer(),

  id_departamento: Type.Integer(),
  departamento: Type.String(),

  id_eleccion: Type.Integer(),
  eleccion_fecha: Type.String(),
  eleccion_tipo: Type.String(),
  eleccion_descripcion: Type.Optional(Type.String()),

  presidente: integranteModel,
  secretario: integranteModel,
  vocal: integranteModel,

  habilitados: Type.Integer(),
  votos_emitidos: Type.Integer(),
  votos_validos: Type.Integer(),
  votos_anulados: Type.Integer(),
  votos_blancos: Type.Integer(),
  votos_observados: Type.Integer(),

  seguridad: Type.Array(agenteSeguridadModel),
  papeletas: Type.Array(papeletaResultadoModel),
});
export type MesaActual = Static<typeof mesaActualModel>;

// La credencial nunca viaja en el body: siempre es la del usuario autenticado (req.user),
// así se garantiza que nadie pueda votar en nombre de otro ciudadano.
export const verificarVotanteBodyModel = Type.Object({
  numero_circuito_ingresado: Type.String({ minLength: 1, maxLength: 20 }),
});
export type VerificarVotanteBody = Static<typeof verificarVotanteBodyModel>;

export const verificarVotanteResponseModel = Type.Object({
  nombre_completo: Type.String(),
  ya_voto: Type.Boolean(),
  observado: Type.Boolean(),
});
export type VerificarVotanteResponse = Static<typeof verificarVotanteResponseModel>;

export const emitirVotoBodyModel = Type.Object({
  numero_circuito_ingresado: Type.String({ minLength: 1, maxLength: 20 }),
  id_papeletas: Type.Array(Type.Integer()),
});
export type EmitirVotoBody = Static<typeof emitirVotoBodyModel>;

export const VotoEmitidoEstadoEnum = Type.Union([
  Type.Literal("Valido"),
  Type.Literal("Anulado"),
  Type.Literal("Blanco"),
]);

export const emitirVotoResponseModel = Type.Object({
  id_voto: Type.Integer(),
  estado: VotoEmitidoEstadoEnum,
  observado: Type.Boolean(),
});
export type EmitirVotoResponse = Static<typeof emitirVotoResponseModel>;
