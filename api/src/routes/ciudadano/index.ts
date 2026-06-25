import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@fastify/type-provider-typebox";
import { ciudadanoModel, ciudadanoPostModel } from "../../models/ciudadanoModel.js";

const ciudadanoRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener ciudadanos",
        tags: ["Ciudadano"],
        description: "Ruta para obtener todos los ciudadanos.",
        response: {
          200: Type.Array(ciudadanoModel),
        },
      },
    },
    async (req, rep) => {
      return await fastify.CiudadanoDB.getAll();
    },
  );

  fastify.post(
    "",
    {
      schema: {
        summary: "Crear ciudadano",
        tags: ["Ciudadano"],
        description: "Ruta para registrar un ciudadano. Se requiere ser administrador.",
        body: ciudadanoPostModel,
        response: {
          201: ciudadanoModel,
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      rep.code(201).send(await fastify.CiudadanoDB.create(req.body));
    },
  );
};

export default ciudadanoRoutes;
