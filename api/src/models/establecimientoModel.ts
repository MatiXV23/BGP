import { type Static, Type } from "@fastify/type-provider-typebox";

export const EstablecimientoTipoEnum = Type.Union([
  Type.Literal("Escuela"),
  Type.Literal("Liceo"),
  Type.Literal("Universidad"),
  Type.Literal("Otro"),
]);

export const establecimientoModel = Type.Object({
  id_establecimiento: Type.Integer(),
  nombre: Type.String({ maxLength: 150 }),
  tipo: EstablecimientoTipoEnum,
  id_zona: Type.Integer(),
});
export type Establecimiento = Static<typeof establecimientoModel>;

export const establecimientoPostModel = Type.Object({
  nombre: Type.String({ maxLength: 150 }),
  tipo: EstablecimientoTipoEnum,
  id_zona: Type.Integer(),
});
export type EstablecimientoPost = Static<typeof establecimientoPostModel>;
