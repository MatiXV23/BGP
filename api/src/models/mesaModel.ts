import { type Static, Type } from "@fastify/type-provider-typebox";

export const mesaModel = Type.Object({
  id_mesa: Type.Integer(),
  id_circuito: Type.Integer(),
  id_eleccion: Type.Integer(),
  ci_presidente: Type.String({ maxLength: 8 }),
  ci_secretario: Type.String({ maxLength: 8 }),
  ci_vocal: Type.String({ maxLength: 8 }),
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
