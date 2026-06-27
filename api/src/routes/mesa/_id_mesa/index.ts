import { type FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { mesaModel } from "../../../models/mesaModel.js";

const mesaByIdRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    "",
    {
      schema: {
        summary: "Obtener mesa",
        tags: ["Mesa"],
        description: "Ruta para obtener una mesa electoral por ID.",
        params: Type.Pick(mesaModel, ["id_mesa"]),
        response: {
          200: mesaModel,
        },
      },
    },
    async (req, rep) => {
      return await fastify.MesaDB.getById(req.params.id_mesa);
    },
  );

  fastify.put(
    "",
    {
      schema: {
        summary: "Modificar mesa",
        tags: ["Mesa"],
        description: "Ruta para modificar una mesa electoral. Se requiere ser administrador.",
        params: Type.Pick(mesaModel, ["id_mesa"]),
        body: mesaModel,
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.MesaDB.update(req.params.id_mesa, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.patch(
    "",
    {
      schema: {
        summary: "Modificar mesa parcialmente",
        tags: ["Mesa"],
        description: "Ruta para modificar parcialmente una mesa electoral. Se requiere ser administrador.",
        params: Type.Pick(mesaModel, ["id_mesa"]),
        body: Type.Partial(mesaModel),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.MesaDB.update(req.params.id_mesa, req.body);
      rep.code(204).send(null);
    },
  );

  fastify.delete(
    "",
    {
      schema: {
        summary: "Eliminar mesa",
        tags: ["Mesa"],
        description: "Ruta para eliminar una mesa electoral. Se requiere ser administrador.",
        params: Type.Pick(mesaModel, ["id_mesa"]),
        response: {
          204: Type.Null(),
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: [fastify.authenticate],
      preHandler: [fastify.isAdminOrOwner],
    },
    async (req, rep) => {
      await fastify.MesaDB.delete(req.params.id_mesa);
      rep.code(204).send(null);
    },
  );
};

export default mesaByIdRoutes;
