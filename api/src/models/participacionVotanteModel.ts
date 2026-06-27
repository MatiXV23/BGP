import { type Static, Type } from "@fastify/type-provider-typebox";

export const participacionVotanteModel = Type.Object({
  id_participacion: Type.Number(),
  credencial_civica: Type.String({ maxLength: 10 }),
  id_eleccion: Type.Integer(),
  fecha_hora: Type.String({ format: "date-time" }),
  es_observado: Type.Boolean(),
  id_circuito: Type.Integer(),
});
export type ParticipacionVotante = Static<typeof participacionVotanteModel>;

export const participacionVotantePostModel = Type.Object({
  credencial_civica: Type.String({ maxLength: 10 }),
  id_eleccion: Type.Integer(),
  es_observado: Type.Boolean(),
  id_circuito: Type.Integer(),
});
export type ParticipacionVotantePost = Static<typeof participacionVotantePostModel>;
