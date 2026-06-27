import { type Static, Type } from "@fastify/type-provider-typebox";

export const miembroMesaModel = Type.Object({
  cedula_identidad: Type.String({ maxLength: 8 }),
  id_organismo: Type.Integer(),
});
export type MiembroMesa = Static<typeof miembroMesaModel>;

export const miembroMesaPostModel = Type.Object({
  cedula_identidad: Type.String({ maxLength: 8 }),
  id_organismo: Type.Integer(),
});
export type MiembroMesaPost = Static<typeof miembroMesaPostModel>;
