import { type Static, Type } from "@fastify/type-provider-typebox";

export const zonaModel = Type.Object({
  id_zona: Type.Integer(),
  nombre: Type.String({ maxLength: 100 }),
  id_departamento: Type.Integer(),
});
export type Zona = Static<typeof zonaModel>;

export const zonaPostModel = Type.Object({
  nombre: Type.String({ maxLength: 100 }),
  id_departamento: Type.Integer(),
});
export type ZonaPost = Static<typeof zonaPostModel>;
