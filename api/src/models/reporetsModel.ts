import { type Static, Type } from "@fastify/type-provider-typebox";

export const resultadoEleccionModel = Type.Object({
  id_eleccion: Type.Integer(),
  fecha: Type.String(),
  tipo_eleccion: Type.String(),

  id_papeleta: Type.Integer(),
  numero_lista: Type.Optional(Type.Integer()),
  papeleta: Type.Optional(Type.String()),
  partido: Type.Optional(Type.String()),

  votos_emitidos: Type.Integer(),
  votos_validos: Type.Integer(),
  votos_anulados: Type.Integer(),
  votos_blancos: Type.Integer(),
  votos_observados: Type.Integer(),
});

export type ResultadoEleccion = Static<typeof resultadoEleccionModel>;

export const votosPorDepartamentoModel = Type.Object({
  id_eleccion: Type.Integer(),
  fecha: Type.String(),

  id_departamento: Type.Integer(),
  departamento: Type.String(),

  votos_emitidos: Type.Integer(),
  votos_validos: Type.Integer(),
  votos_anulados: Type.Integer(),
  votos_blancos: Type.Integer(),
  votos_observados: Type.Integer(),
});

export type VotosPorDepartamento = Static<typeof votosPorDepartamentoModel>;

export const votosPorPartidoModel = Type.Object({
  id_eleccion: Type.Integer(),
  fecha: Type.String(),

  id_partido: Type.Integer(),
  partido: Type.String(),

  votos_emitidos: Type.Integer(),
  votos_validos: Type.Integer(),
  votos_anulados: Type.Integer(),
  votos_blancos: Type.Integer(),
  votos_observados: Type.Integer(),
});

export type VotosPorPartido = Static<typeof votosPorPartidoModel>;

export const votosPorCandidatoModel = Type.Object({
  id_eleccion: Type.Integer(),
  fecha: Type.String(),
  tipo_eleccion: Type.String(),

  cedula_candidato: Type.String(),
  candidato: Type.String(),

  id_partido: Type.Optional(Type.Integer()),
  partido: Type.Optional(Type.String()),

  id_papeleta: Type.Integer(),
  numero_lista: Type.Optional(Type.Integer()),
  papeleta: Type.Optional(Type.String()),
  organo_candidatura: Type.Optional(Type.String()),

  tipo_vinculo: Type.String(),
  orden: Type.Optional(Type.Integer()),

  votos_emitidos: Type.Integer(),
  votos_validos: Type.Integer(),
  votos_anulados: Type.Integer(),
  votos_blancos: Type.Integer(),
  votos_observados: Type.Integer(),
});

export type VotosPorCandidato = Static<typeof votosPorCandidatoModel>;
