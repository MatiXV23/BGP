import { type FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { mesaModel } from "../../../../models/mesaModel.js";

const mesaCerrarRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.put(
    "",
    {
      schema: {
        summary: "Cerrar mesa",
        tags: ["Mesa"],
        description: "Ruta para cerrar una mesa de votación. Se requiere ser administrador.",
        params: Type.Pick(mesaModel, ["id_mesa"]),
        response: {
          200: mesaModel,
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdmin],
    },
    async (req, rep) => {
      return await fastify.MesaDB.cerrar(req.params.id_mesa);
    },
  );
};

export default mesaCerrarRoutes;
