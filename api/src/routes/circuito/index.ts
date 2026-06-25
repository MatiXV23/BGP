import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@fastify/type-provider-typebox";
import { circuitoModel, circuitoPostModel } from "../../models/circuitoModel.js";

const circuitoRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener circuitos",
        tags: ["Circuito"],
        description: "Ruta para obtener todos los circuitos electorales.",
        response: {
          200: Type.Array(circuitoModel),
        },
      },
    },
    async (req, rep) => {
      return await fastify.CircuitoDB.getAll();
    },
  );

  fastify.post(
    "",
    {
      schema: {
        summary: "Crear circuito",
        tags: ["Circuito"],
        description: "Ruta para crear un circuito electoral. Se requiere ser administrador.",
        body: circuitoPostModel,
        response: {
          201: circuitoModel,
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      rep.code(201).send(await fastify.CircuitoDB.create(req.body));
    },
  );
};

export default circuitoRoutes;
