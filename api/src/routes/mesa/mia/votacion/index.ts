import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { mesaActualModel } from "../../../../models/mesaModel.js";

const mesaMiaVotacionRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener mi mesa de votación",
        tags: ["Mesa"],
        description:
          "Ruta para obtener la mesa (y todos sus datos) del circuito donde el usuario logeado está habilitado para votar. A diferencia de /mesa/mia, no requiere integrar la autoridad de la mesa.",
        response: {
          200: mesaActualModel,
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
    },
    async (req, rep) => {
      return await fastify.MesaDB.getMiaVotacion(req.user.cedula_identidad);
    },
  );
};

export default mesaMiaVotacionRoutes;
