import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@fastify/type-provider-typebox";
import { agentePolicialModel, agentePolicialPostModel } from "../../models/agentePolicialModel.js";

const agentePolicialRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener agentes policiales",
        tags: ["AgentePolicial"],
        description: "Ruta para obtener todos los agentes policiales.",
        response: {
          200: Type.Array(agentePolicialModel),
        },
      },
    },
    async (req, rep) => {
      return await fastify.AgentePolicialDB.getAll();
    },
  );

  fastify.post(
    "",
    {
      schema: {
        summary: "Crear agente policial",
        tags: ["AgentePolicial"],
        description: "Ruta para registrar un agente policial. Se requiere ser administrador.",
        body: agentePolicialPostModel,
        response: {
          201: agentePolicialModel,
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      rep.code(201).send(await fastify.AgentePolicialDB.create(req.body));
    },
  );
};

export default agentePolicialRoutes;
