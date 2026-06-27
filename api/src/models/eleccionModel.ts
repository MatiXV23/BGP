import { type Static, Type } from "@fastify/type-provider-typebox";

export const eleccionModel = Type.Object({
  id_eleccion: Type.Integer(),
  fecha: Type.String({ format: "date" }),
  id_tipo: Type.Integer(),
  descripcion: Type.Optional(Type.String({ maxLength: 255 })),
});
export type Eleccion = Static<typeof eleccionModel>;

export const eleccionPostModel = Type.Object({
  fecha: Type.String({ format: "date" }),
  id_tipo: Type.Integer(),
  descripcion: Type.Optional(Type.String({ maxLength: 255 })),
});
export type EleccionPost = Static<typeof eleccionPostModel>;
