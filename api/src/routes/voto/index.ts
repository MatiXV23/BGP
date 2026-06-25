import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@fastify/type-provider-typebox";
import { votoModel, votoPostModel } from "../../models/votoModel.js";

const votoRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener votos",
        tags: ["Voto"],
        description: "Ruta para obtener todos los votos registrados.",
        response: {
          200: Type.Array(votoModel),
        },
      },
    },
    async (req, rep) => {
      return await fastify.VotoDB.getAll();
    },
  );

  // Emitir un voto (registro anónimo vinculado a circuito y elección)
  fastify.post(
    "",
    {
      schema: {
        summary: "Registrar voto",
        tags: ["Voto"],
        description: "Ruta para registrar un voto en una elección. Se requiere autenticación.",
        body: votoPostModel,
        response: {
          201: votoModel,
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      rep.code(201).send(await fastify.VotoDB.create(req.body));
    },
  );
};

export default votoRoutes;
