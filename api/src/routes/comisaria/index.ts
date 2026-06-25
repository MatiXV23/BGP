import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@fastify/type-provider-typebox";
import { comisariaModel, comisariaPostModel } from "../../models/comisariaModel.js";

const comisariaRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener comisarías",
        tags: ["Comisaria"],
        description: "Ruta para obtener todas las comisarías.",
        response: {
          200: Type.Array(comisariaModel),
        },
      },
    },
    async (req, rep) => {
      return await fastify.ComisariaDB.getAll();
    },
  );

  fastify.post(
    "",
    {
      schema: {
        summary: "Crear comisaría",
        tags: ["Comisaria"],
        description: "Ruta para crear una comisaría. Se requiere ser administrador.",
        body: comisariaPostModel,
        response: {
          201: comisariaModel,
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      rep.code(201).send(await fastify.ComisariaDB.create(req.body));
    },
  );
};

export default comisariaRoutes;
