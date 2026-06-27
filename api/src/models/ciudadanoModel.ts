import { type Static, Type } from "@fastify/type-provider-typebox";

export const ciudadanoModel = Type.Object({
  cedula_identidad: Type.String({ maxLength: 8 }),
  credencial_civica: Type.String({ maxLength: 10 }),
  nombre_completo: Type.String({ maxLength: 150 }),
  fecha_nacimiento: Type.String({ format: "date" }),
});
export type Ciudadano = Static<typeof ciudadanoModel>;

export const ciudadanoPostModel = Type.Object({
  cedula_identidad: Type.String({ maxLength: 8 }),
  credencial_civica: Type.String({ maxLength: 10 }),
  nombre_completo: Type.String({ maxLength: 150 }),
  fecha_nacimiento: Type.String({ format: "date" }),
});
export type CiudadanoPost = Static<typeof ciudadanoPostModel>;
