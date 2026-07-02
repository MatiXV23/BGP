import { type FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { usuarioModel } from "../../../models/usuarioModel.js";

const usuarioByIdRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener usuario",
        tags: ["Usuario"],
        description: "Ruta para obtener un usuario por id. Se requiere ser administrador o el propio usuario.",
        params: Type.Pick(usuarioModel, ["id_usuario"]),
        response: {
          200: usuarioModel,
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      return await fastify.UsuarioDB.getById(req.params.id_usuario);
    },
  );

  fastify.put(
    "",
    {
      schema: {
        summary: "Modificar usuario",
        tags: ["Usuario"],
        description: "Ruta para modificar un usuario. Se requiere ser administrador o el propio usuario.",
        params: Type.Pick(usuarioModel, ["id_usuario"]),
        body: Type.Pick(usuarioModel, ["cedula_identidad", "is_admin"]),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.UsuarioDB.update(req.params.id_usuario, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.patch(
    "",
    {
      schema: {
        summary: "Modificar usuario parcialmente",
        tags: ["Usuario"],
        description: "Ruta para modificar parcialmente un usuario. Se requiere ser administrador o el propio usuario.",
        params: Type.Pick(usuarioModel, ["id_usuario"]),
        body: Type.Partial(Type.Pick(usuarioModel, ["cedula_identidad", "is_admin"])),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.UsuarioDB.update(req.params.id_usuario, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.delete(
    "",
    {
      schema: {
        summary: "Eliminar usuario",
        tags: ["Usuario"],
        description: "Ruta para eliminar un usuario. Se requiere ser administrador.",
        params: Type.Pick(usuarioModel, ["id_usuario"]),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdmin],
    },
    async (req, rep) => {
      await fastify.UsuarioDB.delete(req.params.id_usuario);
      rep.code(204).send(null);
    },
  );
};

export default usuarioByIdRoutes;
