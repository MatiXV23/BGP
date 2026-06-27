import { type Static, Type } from "@fastify/type-provider-typebox";

export const partidoPoliticoModel = Type.Object({
  id_partido: Type.Integer(),
  nombre: Type.String({ maxLength: 150 }),
  direccion_sede: Type.Optional(Type.String({ maxLength: 200 })),
});
export type PartidoPolitico = Static<typeof partidoPoliticoModel>;

export const partidoPoliticoPostModel = Type.Object({
  nombre: Type.String({ maxLength: 150 }),
  direccion_sede: Type.Optional(Type.String({ maxLength: 200 })),
});
export type PartidoPoliticoPost = Static<typeof partidoPoliticoPostModel>;
