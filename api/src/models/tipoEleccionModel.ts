import { type Static, Type } from "@fastify/type-provider-typebox";

export const TipoEleccionNombreEnum = Type.Union([
  Type.Literal("Presidencial"),
  Type.Literal("Ballotage"),
  Type.Literal("Municipal"),
  Type.Literal("Plebiscito"),
  Type.Literal("Referendum"),
  Type.Literal("Interna"),
]);

export const tipoEleccionModel = Type.Object({
  id_tipo: Type.Integer(),
  nombre: TipoEleccionNombreEnum,
});
export type TipoEleccion = Static<typeof tipoEleccionModel>;

export const tipoEleccionPostModel = Type.Object({
  nombre: TipoEleccionNombreEnum,
});
export type TipoEleccionPost = Static<typeof tipoEleccionPostModel>;
