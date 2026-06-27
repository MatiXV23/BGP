import { type FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { comisariaModel } from "../../../models/comisariaModel.js";

const comisariaByIdRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener comisaría",
        tags: ["Comisaria"],
        description: "Ruta para obtener una comisaría por ID.",
        params: Type.Pick(comisariaModel, ["id_comisaria"]),
        response: {
          200: comisariaModel,
        },
      },
    },
    async (req, rep) => {
      return await fastify.ComisariaDB.getById(req.params.id_comisaria);
    },
  );

  fastify.put(
    "",
    {
      schema: {
        summary: "Modificar comisaría",
        tags: ["Comisaria"],
        description: "Ruta para modificar una comisaría. Se requiere ser administrador.",
        params: Type.Pick(comisariaModel, ["id_comisaria"]),
        body: comisariaModel,
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.ComisariaDB.update(req.params.id_comisaria, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.patch(
    "",
    {
      schema: {
        summary: "Modificar comisaría parcialmente",
        tags: ["Comisaria"],
        description: "Ruta para modificar parcialmente una comisaría. Se requiere ser administrador.",
        params: Type.Pick(comisariaModel, ["id_comisaria"]),
        body: Type.Partial(comisariaModel),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.ComisariaDB.update(req.params.id_comisaria, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.delete(
    "",
    {
      schema: {
        summary: "Eliminar comisaría",
        tags: ["Comisaria"],
        description: "Ruta para eliminar una comisaría. Se requiere ser administrador.",
        params: Type.Pick(comisariaModel, ["id_comisaria"]),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.ComisariaDB.delete(req.params.id_comisaria);
      rep.code(204).send(null);
    },
  );
};

export default comisariaByIdRoutes;
