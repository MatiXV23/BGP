import { type Static, Type } from "@fastify/type-provider-typebox";

export const usuarioModel = Type.Object({
  id_usuario: Type.Integer(),
  cedula_identidad: Type.String({ minLength: 8, maxLength: 8 }),
  is_admin: Type.Boolean(),
  nombre_completo: Type.Optional(Type.String({ maxLength: 150 })),
  credencial_civica: Type.Optional(Type.String({ maxLength: 10 })),
}, {examples: [
  {
    id_usuario: 1,
    cedula_identidad: "12345678",
    is_admin: true,
    nombre_completo: "Ana García Pérez",
    credencial_civica: "ABA1234567",
  }
]});
export type Usuario = Static<typeof usuarioModel>;

export const usuarioPostModel = Type.Object({
  cedula_identidad: Type.String({ minLength: 8, maxLength: 8 }),
  is_admin: Type.Optional(Type.Boolean({ default: false })),
  password: Type.String({ minLength: 4 }),
}, {
  examples: [
    {
      cedula_identidad: "12345678",
      is_admin: false,
      password: "pass1234",
    }
  ]
});
export type UsuarioPost = Static<typeof usuarioPostModel>;

export const JWTuserModel = Type.Object({
  id_usuario: Type.Integer(),
  cedula_identidad: Type.String({ minLength: 8, maxLength: 8 }),
  is_admin: Type.Boolean(),
});
export type JWTUsuario = Static<typeof JWTuserModel>;
