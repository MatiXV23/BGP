import { type Static, Type } from "@fastify/type-provider-typebox";

export const comisariaModel = Type.Object({
  id_comisaria: Type.Integer(),
  nombre: Type.String({ maxLength: 100 }),
  id_departamento: Type.Integer(),
});
export type Comisaria = Static<typeof comisariaModel>;

export const comisariaPostModel = Type.Object({
  nombre: Type.String({ maxLength: 100 }),
  id_departamento: Type.Integer(),
});
export type ComisariaPost = Static<typeof comisariaPostModel>;
