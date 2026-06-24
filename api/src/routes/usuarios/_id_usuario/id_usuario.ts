import {
  type FastifyPluginAsyncTypebox,
  Type,
} from "@fastify/type-provider-typebox";
import { usuarioModel } from "../../../models/usuarioModel.js";

const usersByIdRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener usuario",
        tags: ["Usuario"],
        description: "Ruta para obtener un usuario.",
        params: Type.Pick(usuarioModel, ["id_usuario"]),
        response: {
          200: usuarioModel,
        },
      },
    },
    async (req, rep) => {
      return fastify.UsuariosDB.getById(req.params.id_usuario);
    },
  );

  fastify.put(
    "",
    {
      schema: {
        summary: "Modificar usuario",
        tags: ["Usuario"],
        description:
          "Ruta para modificar un usuario. Se requiere ser el usuario dueño o ser un administrador",
        body: usuarioModel,
        params: Type.Pick(usuarioModel, ["id_usuario"]),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.UsuariosDB.update(req.params.id_usuario, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.patch(
    "",
    {
      schema: {
        summary: "Modificar usuario",
        tags: ["Usuario"],
        description:
          "Ruta para modificar un usuario. Se requiere ser el usuario dueño o ser un administrador",
        body: Type.Partial(usuarioModel),
        params: Type.Pick(usuarioModel, ["id_usuario"]),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.UsuariosDB.update(req.params.id_usuario, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.delete(
    "",
    {
      schema: {
        summary: "Eliminar usuario",
        tags: ["Usuario"],
        description:
          "Ruta para eliminar un usuario. Se requiere ser el usuario dueño o ser un administrador",
        params: Type.Pick(usuarioModel, ["id_usuario"]),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      fastify.UsuariosDB.delete(req.params.id_usuario);
    },
  );

  fastify.put(
    "/pwd",
    {
      schema: {
        summary: "Modificar password de usuario",
        tags: ["Usuario"],
        description:
          "Ruta para modificar la password un usuario. Se requiere ser el usuario dueño",
        body: Type.Object({ password: Type.String() }),
        params: Type.Pick(usuarioModel, ["id_usuario"]),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isOwner],
    },
    async (req, rep) => {
      await fastify.UsuariosDB.updatePass(
        req.params.id_usuario,
        req.body.password,
      );
      rep.code(204).send(null);
    },
  );
};

export default usersByIdRoutes;
