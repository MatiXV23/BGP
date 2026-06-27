import { type Static, Type } from "@fastify/type-provider-typebox";

export const organismoEstadoModel = Type.Object({
  id_organismo: Type.Integer(),
  nombre: Type.String({ maxLength: 150 }),
});
export type OrganismoEstado = Static<typeof organismoEstadoModel>;

export const organismoEstadoPostModel = Type.Object({
  nombre: Type.String({ maxLength: 150 }),
});
export type OrganismoEstadoPost = Static<typeof organismoEstadoPostModel>;
