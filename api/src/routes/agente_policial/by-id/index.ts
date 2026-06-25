import { type FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { agentePolicialModel } from "../../../models/agentePolicialModel.js";

const agentePolicialByIdRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener agente policial",
        tags: ["AgentePolicial"],
        description: "Ruta para obtener un agente policial por cédula de identidad.",
        params: Type.Pick(agentePolicialModel, ["cedula_identidad"]),
        response: {
          200: agentePolicialModel,
        },
      },
    },
    async (req, rep) => {
      return await fastify.AgentePolicialDB.getById(req.params.cedula_identidad);
    },
  );

  fastify.put(
    "",
    {
      schema: {
        summary: "Modificar agente policial",
        tags: ["AgentePolicial"],
        description: "Ruta para modificar un agente policial. Se requiere ser administrador.",
        params: Type.Pick(agentePolicialModel, ["cedula_identidad"]),
        body: agentePolicialModel,
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.AgentePolicialDB.update(req.params.cedula_identidad, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.patch(
    "",
    {
      schema: {
        summary: "Modificar agente policial parcialmente",
        tags: ["AgentePolicial"],
        description: "Ruta para modificar parcialmente un agente policial. Se requiere ser administrador.",
        params: Type.Pick(agentePolicialModel, ["cedula_identidad"]),
        body: Type.Partial(agentePolicialModel),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.AgentePolicialDB.update(req.params.cedula_identidad, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.delete(
    "",
    {
      schema: {
        summary: "Eliminar agente policial",
        tags: ["AgentePolicial"],
        description: "Ruta para eliminar un agente policial. Se requiere ser administrador.",
        params: Type.Pick(agentePolicialModel, ["cedula_identidad"]),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.AgentePolicialDB.delete(req.params.cedula_identidad);
      rep.code(204).send(null);
    },
  );
};

export default agentePolicialByIdRoutes;
