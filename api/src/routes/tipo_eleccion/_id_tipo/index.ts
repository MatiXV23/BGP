import { type FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { tipoEleccionModel } from "../../../models/tipoEleccionModel.js";

const tipoEleccionByIdRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener tipo de elección",
        tags: ["TipoEleccion"],
        description: "Ruta para obtener un tipo de elección por ID.",
        params: Type.Pick(tipoEleccionModel, ["id_tipo"]),
        response: {
          200: tipoEleccionModel,
        },
      },
    },
    async (req, rep) => {
      return await fastify.TipoEleccionDB.getById(req.params.id_tipo);
    },
  );

  fastify.put(
    "",
    {
      schema: {
        summary: "Modificar tipo de elección",
        tags: ["TipoEleccion"],
        description: "Ruta para modificar un tipo de elección. Se requiere ser administrador.",
        params: Type.Pick(tipoEleccionModel, ["id_tipo"]),
        body: tipoEleccionModel,
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.TipoEleccionDB.update(req.params.id_tipo, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.patch(
    "",
    {
      schema: {
        summary: "Modificar tipo de elección parcialmente",
        tags: ["TipoEleccion"],
        description: "Ruta para modificar parcialmente un tipo de elección. Se requiere ser administrador.",
        params: Type.Pick(tipoEleccionModel, ["id_tipo"]),
        body: Type.Partial(tipoEleccionModel),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.TipoEleccionDB.update(req.params.id_tipo, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.delete(
    "",
    {
      schema: {
        summary: "Eliminar tipo de elección",
        tags: ["TipoEleccion"],
        description: "Ruta para eliminar un tipo de elección. Se requiere ser administrador.",
        params: Type.Pick(tipoEleccionModel, ["id_tipo"]),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.TipoEleccionDB.delete(req.params.id_tipo);
      rep.code(204).send(null);
    },
  );
};

export default tipoEleccionByIdRoutes;
