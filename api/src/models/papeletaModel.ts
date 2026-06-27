import { type Static, Type } from "@fastify/type-provider-typebox";

export const OrganoEnum = Type.Union([
  Type.Literal("Senadores"),
  Type.Literal("Diputados"),
  Type.Literal("Junta Departamental"),
  Type.Literal("Concejo Municipal"),
]);

export const papeletaModel = Type.Object({
  id_papeleta: Type.Integer(),
  id_eleccion: Type.Integer(),
  numero_lista: Type.Optional(Type.Integer()),
  es_lista: Type.Boolean(),
  descripcion: Type.Optional(Type.String({ maxLength: 100 })),
  color: Type.Optional(Type.String({ maxLength: 50 })),
  id_partido: Type.Optional(Type.Integer()),
  organo_candidatura: Type.Optional(OrganoEnum),
  id_departamento: Type.Optional(Type.Integer()),
});
export type Papeleta = Static<typeof papeletaModel>;

export const papeletaPostModel = Type.Object({
  id_eleccion: Type.Integer(),
  numero_lista: Type.Optional(Type.Integer()),
  es_lista: Type.Boolean(),
  descripcion: Type.Optional(Type.String({ maxLength: 100 })),
  color: Type.Optional(Type.String({ maxLength: 50 })),
  id_partido: Type.Optional(Type.Integer()),
  organo_candidatura: Type.Optional(OrganoEnum),
  id_departamento: Type.Optional(Type.Integer()),
});
export type PapeletaPost = Static<typeof papeletaPostModel>;
