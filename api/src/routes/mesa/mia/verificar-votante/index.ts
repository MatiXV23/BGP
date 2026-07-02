import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { verificarVotanteBodyModel, verificarVotanteResponseModel } from "../../../../models/mesaModel.js";

const verificarVotanteRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    "",
    {
      schema: {
        summary: "Verificar votante",
        tags: ["Mesa"],
        description:
          "Verifica una credencial cívica contra la mesa del usuario logeado: si ya votó en esta elección y si el circuito ingresado coincide con el asignado por padrón.",
        body: verificarVotanteBodyModel,
        response: {
          200: verificarVotanteResponseModel,
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
    },
    async (req, rep) => {
      return await fastify.MesaDB.verificarVotante(req.user.cedula_identidad, req.body);
    },
  );
};

export default verificarVotanteRoutes;
