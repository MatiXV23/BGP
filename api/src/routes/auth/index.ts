import { type FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import type { SignOptions } from "@fastify/jwt";
import { credencialesModel } from "../../models/credencialesModel.js";
import { usuarioModel } from "../../models/usuarioModel.js";

const authRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    "",
    {
      schema: {
        summary: "Login",
        description: "Ruta para autenticarse con cédula de identidad y contraseña.",
        tags: ["Auth"],
        body: credencialesModel,
        response: {
          200: Type.Object({ token: Type.String() }),
        },
      },
    },
    async (request, reply) => {
      const usuario = await fastify.UsuarioDB.verifyCredentials(
        request.body.cedula_identidad,
        request.body.password,
      );

      const signOptions: SignOptions = {
        expiresIn: "8h",
        notBefore: 0,
      };
      const token = fastify.jwt.sign(usuario, signOptions);
      return { token };
    },
  );

  fastify.get(
    "",
    {
      schema: {
        summary: "Usuario logeado",
        description: "Devuelve los datos del usuario autenticado.",
        tags: ["Auth"],
        response: {
          200: usuarioModel,
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
    },
    async (request, reply) => {
      return await fastify.UsuarioDB.getById(request.user.id_usuario);
    },
  );
};

export default authRoutes;
