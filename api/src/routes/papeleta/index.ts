import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@fastify/type-provider-typebox";
import { papeletaModel, papeletaPostModel } from "../../models/papeletaModel.js";

const papeletaRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener papeletas",
        tags: ["Papeleta"],
        description: "Ruta para obtener todas las papeletas.",
        response: {
          200: Type.Array(papeletaModel),
        },
      },
    },
    async (req, rep) => {
      return await fastify.PapeletaDB.getAll();
    },
  );

  fastify.post(
    "",
    {
      schema: {
        summary: "Crear papeleta",
        tags: ["Papeleta"],
        description: "Ruta para crear una papeleta. Se requiere ser administrador.",
        body: papeletaPostModel,
        response: {
          201: papeletaModel,
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      rep.code(201).send(await fastify.PapeletaDB.create(req.body));
    },
  );
};

export default papeletaRoutes;
