import { type FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { usuarioModel, usuarioPostModel } from "../../models/usuarioModel.js";

const usuarioRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener usuarios",
        tags: ["Usuario"],
        description: "Ruta para obtener todos los usuarios. Se requiere ser administrador.",
        response: {
          200: Type.Array(usuarioModel),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdmin],
    },
    async (req, rep) => {
      return await fastify.UsuarioDB.getAll();
    },
  );

  fastify.post(
    "",
    {
      schema: {
        summary: "Crear usuario",
        tags: ["Usuario"],
        description: "Ruta para dar de alta un usuario del sistema. Se requiere ser administrador.",
        body: usuarioPostModel,
        response: {
          201: usuarioModel,
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdmin],
    },
    async (req, rep) => {
      rep.code(201).send(await fastify.UsuarioDB.create(req.body));
    },
  );
};

export default usuarioRoutes;
