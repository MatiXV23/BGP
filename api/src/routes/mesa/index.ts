import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@fastify/type-provider-typebox";
import { mesaModel, mesaPostModel } from "../../models/mesaModel.js";

const mesaRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener mesas",
        tags: ["Mesa"],
        description: "Ruta para obtener todas las mesas electorales.",
        response: {
          200: Type.Array(mesaModel),
        },
      },
    },
    async (req, rep) => {
      return await fastify.MesaDB.getAll();
    },
  );

  fastify.post(
    "",
    {
      schema: {
        summary: "Crear mesa",
        tags: ["Mesa"],
        description: "Ruta para crear una mesa electoral. Se requiere ser administrador.",
        body: mesaPostModel,
        response: {
          201: mesaModel,
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      rep.code(201).send(await fastify.MesaDB.create(req.body));
    },
  );
};

export default mesaRoutes;
