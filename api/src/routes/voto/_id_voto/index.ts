import { type FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { votoModel } from "../../../models/votoModel.js";

const votoByIdRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener voto",
        tags: ["Voto"],
        description: "Ruta para obtener un voto por ID.",
        params: Type.Pick(votoModel, ["id_voto"]),
        response: {
          200: votoModel,
        },
      },
    },
    async (req, rep) => {
      return await fastify.VotoDB.getById(req.params.id_voto);
    },
  );

  // Los votos son inmutables: no se exponen rutas de modificación ni eliminación
};

export default votoByIdRoutes;
