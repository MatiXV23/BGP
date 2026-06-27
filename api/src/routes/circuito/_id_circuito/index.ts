import { type FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { circuitoModel } from "../../../models/circuitoModel.js";

const circuitoByIdRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener circuito",
        tags: ["Circuito"],
        description: "Ruta para obtener un circuito por ID.",
        params: Type.Pick(circuitoModel, ["id_circuito"]),
        response: {
          200: circuitoModel,
        },
      },
    },
    async (req, rep) => {
      return await fastify.CircuitoDB.getById(req.params.id_circuito);
    },
  );

  fastify.put(
    "",
    {
      schema: {
        summary: "Modificar circuito",
        tags: ["Circuito"],
        description: "Ruta para modificar un circuito. Se requiere ser administrador.",
        params: Type.Pick(circuitoModel, ["id_circuito"]),
        body: circuitoModel,
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.CircuitoDB.update(req.params.id_circuito, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.patch(
    "",
    {
      schema: {
        summary: "Modificar circuito parcialmente",
        tags: ["Circuito"],
        description: "Ruta para modificar parcialmente un circuito. Se requiere ser administrador.",
        params: Type.Pick(circuitoModel, ["id_circuito"]),
        body: Type.Partial(circuitoModel),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.CircuitoDB.update(req.params.id_circuito, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.delete(
    "",
    {
      schema: {
        summary: "Eliminar circuito",
        tags: ["Circuito"],
        description: "Ruta para eliminar un circuito. Se requiere ser administrador.",
        params: Type.Pick(circuitoModel, ["id_circuito"]),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.CircuitoDB.delete(req.params.id_circuito);
      rep.code(204).send(null);
    },
  );
};

export default circuitoByIdRoutes;
