import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@fastify/type-provider-typebox";
import { organismoEstadoModel, organismoEstadoPostModel } from "../../models/organismoEstadoModel.js";

const organismoEstadoRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener organismos del estado",
        tags: ["OrganismoEstado"],
        description: "Ruta para obtener todos los organismos del estado.",
        response: {
          200: Type.Array(organismoEstadoModel),
        },
      },
    },
    async (req, rep) => {
      return await fastify.OrganismoEstadoDB.getAll();
    },
  );

  fastify.post(
    "",
    {
      schema: {
        summary: "Crear organismo del estado",
        tags: ["OrganismoEstado"],
        description: "Ruta para crear un organismo del estado. Se requiere ser administrador.",
        body: organismoEstadoPostModel,
        response: {
          201: organismoEstadoModel,
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      rep.code(201).send(await fastify.OrganismoEstadoDB.create(req.body));
    },
  );
};

export default organismoEstadoRoutes;
