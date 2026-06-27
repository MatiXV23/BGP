import { type Static, Type } from "@fastify/type-provider-typebox";

export const VotoEstadoEnum = Type.Union([
  Type.Literal("Valido"),
  Type.Literal("Anulado"),
  Type.Literal("Blanco"),
]);

export const votoModel = Type.Object({
  id_voto: Type.Number(),
  id_circuito: Type.Integer(),
  id_eleccion: Type.Integer(),
  fecha_hora: Type.String({ format: "date-time" }),
  estado: VotoEstadoEnum,
  es_observado: Type.Boolean(),
});
export type Voto = Static<typeof votoModel>;

export const votoPostModel = Type.Object({
  id_circuito: Type.Integer(),
  id_eleccion: Type.Integer(),
  estado: VotoEstadoEnum,
  es_observado: Type.Boolean(),
});
export type VotoPost = Static<typeof votoPostModel>;
