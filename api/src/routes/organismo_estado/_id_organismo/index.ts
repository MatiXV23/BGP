import { type FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { organismoEstadoModel } from "../../../models/organismoEstadoModel.js";

const organismoEstadoByIdRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener organismo del estado",
        tags: ["OrganismoEstado"],
        description: "Ruta para obtener un organismo del estado por ID.",
        params: Type.Pick(organismoEstadoModel, ["id_organismo"]),
        response: {
          200: organismoEstadoModel,
        },
      },
    },
    async (req, rep) => {
      return await fastify.OrganismoEstadoDB.getById(req.params.id_organismo);
    },
  );

  fastify.put(
    "",
    {
      schema: {
        summary: "Modificar organismo del estado",
        tags: ["OrganismoEstado"],
        description: "Ruta para modificar un organismo del estado. Se requiere ser administrador.",
        params: Type.Pick(organismoEstadoModel, ["id_organismo"]),
        body: organismoEstadoModel,
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.OrganismoEstadoDB.update(req.params.id_organismo, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.patch(
    "",
    {
      schema: {
        summary: "Modificar organismo del estado parcialmente",
        tags: ["OrganismoEstado"],
        description: "Ruta para modificar parcialmente un organismo del estado. Se requiere ser administrador.",
        params: Type.Pick(organismoEstadoModel, ["id_organismo"]),
        body: Type.Partial(organismoEstadoModel),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.OrganismoEstadoDB.update(req.params.id_organismo, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.delete(
    "",
    {
      schema: {
        summary: "Eliminar organismo del estado",
        tags: ["OrganismoEstado"],
        description: "Ruta para eliminar un organismo del estado. Se requiere ser administrador.",
        params: Type.Pick(organismoEstadoModel, ["id_organismo"]),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.OrganismoEstadoDB.delete(req.params.id_organismo);
      rep.code(204).send(null);
    },
  );
};

export default organismoEstadoByIdRoutes;
