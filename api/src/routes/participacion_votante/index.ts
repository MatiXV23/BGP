import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@fastify/type-provider-typebox";
import { participacionVotanteModel, participacionVotantePostModel } from "../../models/participacionVotanteModel.js";

const participacionVotanteRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener participaciones",
        tags: ["ParticipacionVotante"],
        description: "Ruta para obtener todas las participaciones de votantes.",
        response: {
          200: Type.Array(participacionVotanteModel),
        },
      },
    },
    async (req, rep) => {
      return await fastify.ParticipacionVotanteDB.getAll();
    },
  );

  // Registrar que un votante emitió su voto (habilitación en mesa)
  fastify.post(
    "",
    {
      schema: {
        summary: "Registrar participación de votante",
        tags: ["ParticipacionVotante"],
        description: "Ruta para registrar la participación de un votante en una elección. Se requiere autenticación.",
        body: participacionVotantePostModel,
        response: {
          201: participacionVotanteModel,
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      rep.code(201).send(await fastify.ParticipacionVotanteDB.create(req.body));
    },
  );
};

export default participacionVotanteRoutes;
