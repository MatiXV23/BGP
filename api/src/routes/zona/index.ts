import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@fastify/type-provider-typebox";
import { zonaModel, zonaPostModel } from "../../models/zonaModel.js";

const zonaRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener zonas",
        tags: ["Zona"],
        description: "Ruta para obtener todas las zonas.",
        response: {
          200: Type.Array(zonaModel),
        },
      },
    },
    async (req, rep) => {
      return await fastify.ZonaDB.getAll();
    },
  );

  fastify.post(
    "",
    {
      schema: {
        summary: "Crear zona",
        tags: ["Zona"],
        description: "Ruta para crear una zona. Se requiere ser administrador.",
        body: zonaPostModel,
        response: {
          201: zonaModel,
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      rep.code(201).send(await fastify.ZonaDB.create(req.body));
    },
  );
};

export default zonaRoutes;
