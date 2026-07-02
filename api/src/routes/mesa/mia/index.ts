import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { mesaActualModel } from "../../../models/mesaModel.js";

const mesaMiaRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener mi mesa",
        tags: ["Mesa"],
        description: "Ruta para obtener la mesa (y todos sus datos) donde el usuario logeado integra la autoridad.",
        response: {
          200: mesaActualModel,
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
    },
    async (req, rep) => {
      return await fastify.MesaDB.getMia(req.user.cedula_identidad);
    },
  );
};

export default mesaMiaRoutes;
