import { type FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { eleccionModel } from "../../../models/eleccionModel.js";

const eleccionByIdRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener elección",
        tags: ["Eleccion"],
        description: "Ruta para obtener una elección por ID.",
        params: Type.Pick(eleccionModel, ["id_eleccion"]),
        response: {
          200: eleccionModel,
        },
      },
    },
    async (req, rep) => {
      return await fastify.EleccionDB.getById(req.params.id_eleccion);
    },
  );

  fastify.put(
    "",
    {
      schema: {
        summary: "Modificar elección",
        tags: ["Eleccion"],
        description: "Ruta para modificar una elección. Se requiere ser administrador.",
        params: Type.Pick(eleccionModel, ["id_eleccion"]),
        body: eleccionModel,
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.EleccionDB.update(req.params.id_eleccion, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.patch(
    "",
    {
      schema: {
        summary: "Modificar elección parcialmente",
        tags: ["Eleccion"],
        description: "Ruta para modificar parcialmente una elección. Se requiere ser administrador.",
        params: Type.Pick(eleccionModel, ["id_eleccion"]),
        body: Type.Partial(eleccionModel),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.EleccionDB.update(req.params.id_eleccion, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.delete(
    "",
    {
      schema: {
        summary: "Eliminar elección",
        tags: ["Eleccion"],
        description: "Ruta para eliminar una elección. Se requiere ser administrador.",
        params: Type.Pick(eleccionModel, ["id_eleccion"]),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.EleccionDB.delete(req.params.id_eleccion);
      rep.code(204).send(null);
    },
  );
};

export default eleccionByIdRoutes;
