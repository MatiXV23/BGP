import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@fastify/type-provider-typebox";
import { eleccionModel, eleccionPostModel } from "../../models/eleccionModel.js";

const eleccionRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener elecciones",
        tags: ["Eleccion"],
        description: "Ruta para obtener todas las elecciones.",
        response: {
          200: Type.Array(eleccionModel),
        },
      },
    },
    async (req, rep) => {
      return await fastify.EleccionDB.getAll();
    },
  );

  fastify.post(
    "",
    {
      schema: {
        summary: "Crear elección",
        tags: ["Eleccion"],
        description: "Ruta para crear una elección. Se requiere ser administrador.",
        body: eleccionPostModel,
        response: {
          201: eleccionModel,
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      rep.code(201).send(await fastify.EleccionDB.create(req.body));
    },
  );
};

export default eleccionRoutes;
