import { type Static, Type } from "@fastify/type-provider-typebox";

// Modelos de solo lectura, alimentados por las vistas de database/00_init.sql

export const resultadoPapeletaModel = Type.Object({
  id_eleccion: Type.Integer(),
  fecha: Type.String({ format: "date" }),
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
export type ResultadoPapeleta = Static<typeof resultadoPapeletaModel>;

export const resultadoDepartamentoModel = Type.Object({
  id_eleccion: Type.Integer(),
  fecha: Type.String({ format: "date" }),
  id_departamento: Type.Integer(),
  departamento: Type.String(),
  votos_emitidos: Type.Integer(),
  votos_validos: Type.Integer(),
  votos_anulados: Type.Integer(),
  votos_blancos: Type.Integer(),
  votos_observados: Type.Integer(),
});
export type ResultadoDepartamento = Static<typeof resultadoDepartamentoModel>;

export const resultadoPartidoModel = Type.Object({
  id_eleccion: Type.Integer(),
  fecha: Type.String({ format: "date" }),
  id_partido: Type.Integer(),
  partido: Type.String(),
  votos_emitidos: Type.Integer(),
  votos_validos: Type.Integer(),
  votos_anulados: Type.Integer(),
  votos_blancos: Type.Integer(),
  votos_observados: Type.Integer(),
});
export type ResultadoPartido = Static<typeof resultadoPartidoModel>;

export const resultadosEleccionModel = Type.Object({
  porPapeleta: Type.Array(resultadoPapeletaModel),
  porDepartamento: Type.Array(resultadoDepartamentoModel),
  porPartido: Type.Array(resultadoPartidoModel),
});
export type ResultadosEleccion = Static<typeof resultadosEleccionModel>;
