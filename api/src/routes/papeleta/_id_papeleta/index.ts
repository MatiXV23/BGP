import { type FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { papeletaModel } from "../../../models/papeletaModel.js";

const papeletaByIdRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener papeleta",
        tags: ["Papeleta"],
        description: "Ruta para obtener una papeleta por ID.",
        params: Type.Pick(papeletaModel, ["id_papeleta"]),
        response: {
          200: papeletaModel,
        },
      },
    },
    async (req, rep) => {
      return await fastify.PapeletaDB.getById(req.params.id_papeleta);
    },
  );

  fastify.put(
    "",
    {
      schema: {
        summary: "Modificar papeleta",
        tags: ["Papeleta"],
        description: "Ruta para modificar una papeleta. Se requiere ser administrador.",
        params: Type.Pick(papeletaModel, ["id_papeleta"]),
        body: papeletaModel,
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.PapeletaDB.update(req.params.id_papeleta, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.patch(
    "",
    {
      schema: {
        summary: "Modificar papeleta parcialmente",
        tags: ["Papeleta"],
        description: "Ruta para modificar parcialmente una papeleta. Se requiere ser administrador.",
        params: Type.Pick(papeletaModel, ["id_papeleta"]),
        body: Type.Partial(papeletaModel),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.PapeletaDB.update(req.params.id_papeleta, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.delete(
    "",
    {
      schema: {
        summary: "Eliminar papeleta",
        tags: ["Papeleta"],
        description: "Ruta para eliminar una papeleta. Se requiere ser administrador.",
        params: Type.Pick(papeletaModel, ["id_papeleta"]),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.PapeletaDB.delete(req.params.id_papeleta);
      rep.code(204).send(null);
    },
  );
};

export default papeletaByIdRoutes;
