import { type Static, Type } from "@fastify/type-provider-typebox";

export const departamentoModel = Type.Object({
  id_departamento: Type.Integer(),
  nombre: Type.String({ maxLength: 60 }),
});
export type Departamento = Static<typeof departamentoModel>;

export const departamentoPostModel = Type.Object({
  nombre: Type.String({ maxLength: 60 }),
});
export type DepartamentoPost = Static<typeof departamentoPostModel>;
