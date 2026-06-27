import { type Static, Type } from "@fastify/type-provider-typebox";

export const circuitoModel = Type.Object({
  id_circuito: Type.Integer(),
  numero: Type.String({ maxLength: 20 }),
  id_establecimiento: Type.Integer(),
  id_departamento: Type.Integer(),
  localidad: Type.String({ maxLength: 100 }),
  barrio_zona: Type.Optional(Type.String({ maxLength: 100 })),
  es_accesible: Type.Boolean(),
});
export type Circuito = Static<typeof circuitoModel>;

export const circuitoPostModel = Type.Object({
  numero: Type.String({ maxLength: 20 }),
  id_establecimiento: Type.Integer(),
  id_departamento: Type.Integer(),
  localidad: Type.String({ maxLength: 100 }),
  barrio_zona: Type.Optional(Type.String({ maxLength: 100 })),
  es_accesible: Type.Boolean(),
});
export type CircuitoPost = Static<typeof circuitoPostModel>;
