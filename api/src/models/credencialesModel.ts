import { type Static, Type } from "@fastify/type-provider-typebox";

export const credencialesModel = Type.Object({
  cedula_identidad: Type.String({ minLength: 8, maxLength: 8 }),
  password: Type.String({ minLength: 4 }),
}, {
  examples: [
    {
      cedula_identidad: "12345678",
      password: "admin123",
    },
    {
      cedula_identidad: "23456789",
      password: "mesa123",
    }
  ]
});

export type Credenciales = Static<typeof credencialesModel>;
