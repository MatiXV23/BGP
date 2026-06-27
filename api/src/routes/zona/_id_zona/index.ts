import { type FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { zonaModel } from "../../../models/zonaModel.js";

const zonaByIdRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener zona",
        tags: ["Zona"],
        description: "Ruta para obtener una zona por ID.",
        params: Type.Pick(zonaModel, ["id_zona"]),
        response: {
          200: zonaModel,
        },
      },
    },
    async (req, rep) => {
      return await fastify.ZonaDB.getById(req.params.id_zona);
    },
  );

  fastify.put(
    "",
    {
      schema: {
        summary: "Modificar zona",
        tags: ["Zona"],
        description: "Ruta para modificar una zona. Se requiere ser administrador.",
        params: Type.Pick(zonaModel, ["id_zona"]),
        body: zonaModel,
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.ZonaDB.update(req.params.id_zona, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.patch(
    "",
    {
      schema: {
        summary: "Modificar zona parcialmente",
        tags: ["Zona"],
        description: "Ruta para modificar parcialmente una zona. Se requiere ser administrador.",
        params: Type.Pick(zonaModel, ["id_zona"]),
        body: Type.Partial(zonaModel),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.ZonaDB.update(req.params.id_zona, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.delete(
    "",
    {
      schema: {
        summary: "Eliminar zona",
        tags: ["Zona"],
        description: "Ruta para eliminar una zona. Se requiere ser administrador.",
        params: Type.Pick(zonaModel, ["id_zona"]),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.ZonaDB.delete(req.params.id_zona);
      rep.code(204).send(null);
    },
  );
};

export default zonaByIdRoutes;
