import { type FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { participacionVotanteModel } from "../../../models/participacionVotanteModel.js";

const participacionVotanteByIdRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  // GET por id_participacion (BIGINT autoincrement)
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener participación",
        tags: ["ParticipacionVotante"],
        description: "Ruta para obtener el registro de participación de un votante por ID.",
        params: Type.Pick(participacionVotanteModel, ["id_participacion"]),
        response: {
          200: participacionVotanteModel,
        },
      },
    },
    async (req, rep) => {
      return await fastify.ParticipacionVotanteDB.getById(req.params.id_participacion);
    },
  );

  // Las participaciones son registros de auditoría: no se modifican ni eliminan
};

export default participacionVotanteByIdRoutes;
